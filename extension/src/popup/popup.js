// declare constant
const MessageConstant = {
  ACCESS_TOKEN: 'MASSCHECK_ACCESS_TOKEN',
  REFRESH_TOKEN: 'MASSCHECK_REFRESH_TOKEN',
  EXPIRE_TIME_TOKEN: 'MASSCHECK_EXPIRE_TIME_TOKEN',
  DISPLAY_NAME: 'MASSCHECK_DISPLAY_NAME',
  EXT_ACTIVATE_MASSCHECK: 'MASSCHECK_EXT_ACTIVATE_MASSCHECK',
  EXT_DEACTIVATE_MASSCHECK: 'MASSCHECK_EXT_DEACTIVATE_MASSCHECK',
  UID: 'MASSCHECK_UID',
};

const ExtensionLocalStorageConstant = {
  IS_SIGNED_IN: 'masscheck_ext_is_signed_in',
  DISPLAY_NAME: 'masscheck_ext_display_name',
  UID: 'masscheck_ext_uid',
  EXT_IS_ACTIVATE: 'ext_is_activate',
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

const getAccessToken = () => {
  return new Promise((resolve, reject) => {
    massCheckStorage.get(MessageConstant.ACCESS_TOKEN, (err, value) => {
      try {
        resolve(value);
      } catch (err) {
        reject(err);
      }
    });
  });
};

const getDisplayName = () => {
  return new Promise((resolve, reject) => {
    massCheckStorage.get(MessageConstant.DISPLAY_NAME, (err, value) => {
      try {
        resolve(value);
      } catch (err) {
        reject(err);
      }
    });
  });
};

const getUid = () => {
  return new Promise((resolve, reject) => {
    massCheckStorage.get(MessageConstant.UID, (err, value) => {
      try {
        resolve(value);
      } catch (err) {
        reject(err);
      }
    });
  });
};

const init = async () => {
  console.log('check got user signed in');
  let isSignedIn = false;

  try {
    const accessToken = await getAccessToken();
    const displayName = await getDisplayName();
    const uid = await getUid();

    if (accessToken) {
      const isValidToken = await fetch(`${API_ENDPOINT}/auth/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      isSignedIn = isValidToken.status === 200;

      if (isSignedIn) {
        localStorage.setItem(
          ExtensionLocalStorageConstant.IS_SIGNED_IN,
          isSignedIn
        );
        localStorage.setItem(
          ExtensionLocalStorageConstant.DISPLAY_NAME,
          displayName
        );
        localStorage.setItem(ExtensionLocalStorageConstant.UID, uid);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    // clear loading - delay 2 seconds after code executed completed to improve UX
    setTimeout(() => {
      const loadingNode = document.getElementById('loading-spinner');
      loadingNode.classList.remove('loader-container-page-layout');

      if (isSignedIn) {
        window.location.href = 'toggle.html';
      } else {
        const homePageNode = document.querySelector('.homepage');

        homePageNode.classList.remove('homepage');
      }
    }, 500);
  }
};

init();
