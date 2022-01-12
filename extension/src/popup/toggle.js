const MessageConstant = {
  ACCESS_TOKEN: 'MASSCHECK_ACCESS_TOKEN',
  REFRESH_TOKEN: 'MASSCHECK_REFRESH_TOKEN',
  EXPIRE_TIME_TOKEN: 'MASSCHECK_EXPIRE_TIME_TOKEN',
  DISPLAY_NAME: 'MASSCHECK_DISPLAY_NAME',
  EXT_ACTIVATE_MASSCHECK: 'MASSCHECK_EXT_ACTIVATE_MASSCHECK',
  EXT_DEACTIVATE_MASSCHECK: 'MASSCHECK_EXT_DEACTIVATE_MASSCHECK',
  EXT_IS_ACTIVATE: 'MASSCHECK_EXT_IS_ACTIVATE',
  UID: 'MASSCHECK_UID',
};

const ExtensionLocalStorageConstant = {
  IS_SIGNED_IN: 'masscheck_ext_is_signed_in',
  DISPLAY_NAME: 'masscheck_ext_display_name',
  UID: 'masscheck_ext_uid',
};

const API_ENDPOINT = 'http://localhost:3500/api';

// connect to masscheck website local storage
const getId = (data) => {
  const prefix = 'sessionAccessId-';
  let id;

  if (data && data.id && ~data.id.indexOf(prefix)) {
    id = data.id;
  }

  return id;
};

const createId = () => {
  const prefix = 'sessionAccessId-';
  return prefix + Date.now();
};

const storageGuest = (source, parent) => {
  parent = parent || document.body;

  let contentWindow;
  let callbacks = {};
  const sessionRequests = [];
  let connected = false;
  let closed = true;
  let connectedTimeout;
  let isLoaded = false;

  const iframe = document.createElement('iframe');
  iframe.src = source;
  iframe.width = 0;
  iframe.height = 0;
  iframe.style.display = 'none';
  iframe.onload = () => {
    isLoaded = true;
  };

  const handleMessage = (event) => {
    const response = event.data;
    const sessionAccessId = getId(response);

    if (sessionAccessId === 'sessionAccessId-connected') {
      connected = true;
      return;
    }

    if (response.connectError) {
      Object.keys(callbacks).forEach((key) => callbacks[key](response.error));
      callbacks = {};
      return;
    }

    const callback = callbacks[sessionAccessId];

    if (sessionAccessId && callback) {
      callback(response.error, response.data);
    }
  };

  const openStorage = () => {
    parent.appendChild(iframe);
    contentWindow = iframe.contentWindow;
    closed = false;

    window.addEventListener('message', handleMessage);

    checkConnected();
  };

  const close = () => {
    clearTimeout(connectedTimeout);
    window.removeEventListener('message', handleMessage);
    iframe.parentNode.removeChild(iframe);
    connected = false;
    closed = true;
  };

  const message = (method, key, value, callback) => {
    if (closed) {
      openStorage();
    }

    if (!connected && method !== 'connect') {
      sessionRequests.push([method, key, value, callback]);
    }

    const id = createId();

    if (callbacks && typeof callback === 'function') {
      callbacks[id] = callback;
    }

    if (isLoaded) {
      contentWindow.postMessage(
        {
          method,
          key,
          value,
          id,
        },
        source
      );
    }
  };

  const get = (key, callback) => {
    if (!callback) {
      throw new Error('callback required for get');
    }

    message('get', key, null, callback);
  };

  const set = (key, value, callback) => {
    message('set', key, value, callback);
  };

  const remove = (key, callback) => {
    message('remove', key, null, callback);
  };

  const checkConnected = () => {
    if (connected) {
      clearTimeout(connectedTimeout);
      while (sessionRequests.length) {
        message(...sessionRequests.pop());
      }

      return;
    }

    message('connect');

    connectedTimeout = setTimeout(checkConnected, 125);
  };

  openStorage();

  return {
    get,
    set,
    remove,
    close,
  };
};

const massCheckStorage = storageGuest('http://localhost:3000');

const getRefreshToken = () => {
  return new Promise((resolve, reject) => {
    massCheckStorage.get(MessageConstant.REFRESH_TOKEN, (err, value) => {
      try {
        resolve(value);
      } catch (error) {
        reject(err);
      }
    });
  });
};

const clearAccessToken = () => {
  return new Promise((resolve, reject) => {
    massCheckStorage.remove(MessageConstant.ACCESS_TOKEN, (err, value) => {
      try {
        resolve(value);
      } catch (error) {
        reject(err);
      }
    });
  });
};

const clearRefreshToken = () => {
  return new Promise((resolve, reject) => {
    massCheckStorage.remove(MessageConstant.REFRESH_TOKEN, (err, value) => {
      try {
        resolve(value);
      } catch (error) {
        reject(err);
      }
    });
  });
};

const clearDisplayName = () => {
  return new Promise((resolve, reject) => {
    massCheckStorage.remove(MessageConstant.DISPLAY_NAME, (err, value) => {
      try {
        resolve(value);
      } catch (error) {
        reject(err);
      }
    });
  });
};

const clearExpireTimeToken = () => {
  return new Promise((resolve, reject) => {
    massCheckStorage.remove(MessageConstant.EXPIRE_TIME_TOKEN, (err, value) => {
      try {
        resolve(value);
      } catch (error) {
        reject(err);
      }
    });
  });
};

const displayName = localStorage.getItem(
  ExtensionLocalStorageConstant.DISPLAY_NAME
);
const displayNameNode = document.getElementById('display-name');
displayNameNode.innerHTML = displayName || '[UNKNOWN NAME]';

const savedIsToggle = localStorage.getItem(MessageConstant.EXT_IS_ACTIVATE);
let isToggle = savedIsToggle === 'true';

const toggleBtn = document.getElementById('toggle-btn');
toggleBtn.checked = isToggle;
toggleBtn.onclick = () => {
  isToggle = !isToggle;
  localStorage.setItem(MessageConstant.EXT_IS_ACTIVATE, isToggle);

  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    console.log('toggle -> content script');

    const message = {
      type: isToggle
        ? MessageConstant.EXT_ACTIVATE_MASSCHECK
        : MessageConstant.EXT_DEACTIVATE_MASSCHECK,
    };

    chrome.tabs.sendMessage(tabs[0].id, message);
  });
};

const signOutBtn = document.getElementById('sign-out');
signOutBtn.onclick = async () => {
  try {
    const refreshToken = await getRefreshToken();

    fetch(API_ENDPOINT + '/auth/delete-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(async () => {
        // clear masscheck interface
        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
          console.log('toggle -> content script');

          const message = {
            type: MessageConstant.EXT_DEACTIVATE_MASSCHECK,
          };

          chrome.tabs.sendMessage(tabs[0].id, message);
        });

        localStorage.clear();

        await clearDisplayName();
        await clearAccessToken();
        await clearRefreshToken();
        await clearExpireTimeToken();

        window.location.href = 'signin.html';
      });
  } catch (err) {
    console.error(err);
    alert('Failed to sign out. Please try again.');
  }
};
