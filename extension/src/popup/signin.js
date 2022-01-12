const API_ENDPOINT = 'http://localhost:3500/api';

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

const setAccessToken = (accessToken) => {
  return new Promise((resolve, reject) => {
    massCheckStorage.set(
      MessageConstant.ACCESS_TOKEN,
      accessToken,
      (err, value) => {
        try {
          resolve(value);
        } catch (error) {
          reject(err);
        }
      }
    );
  });
};

const setDisplayName = (displayName) => {
  return new Promise((resolve, reject) => {
    massCheckStorage.set(
      MessageConstant.DISPLAY_NAME,
      displayName,
      (err, value) => {
        try {
          resolve(value);
        } catch (error) {
          reject(err);
        }
      }
    );
  });
};

const setRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    massCheckStorage.set(
      MessageConstant.REFRESH_TOKEN,
      refreshToken,
      (err, value) => {
        try {
          resolve(value);
        } catch (error) {
          reject(err);
        }
      }
    );
  });
};

const setExpiredTimeToken = (expiredTimeToken) => {
  return new Promise((resolve, reject) => {
    massCheckStorage.set(
      MessageConstant.EXPIRE_TIME_TOKEN,
      expiredTimeToken,
      (err, value) => {
        try {
          resolve(value);
        } catch (error) {
          reject(err);
        }
      }
    );
  });
};

const postData = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const getData = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    fetch(url + '?' + new URLSearchParams(data), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const signInBtn = document.getElementById('signin');
const emailNode = document.getElementById('email');
const pwdNode = document.getElementById('password');

const errorFieldClass = 'error-field';

emailNode.onkeyup = () => {
  const emailValue = emailNode.value;

  if (emailValue && emailNode.classList.contains(errorFieldClass)) {
    emailNode.classList.remove(errorFieldClass);
  }
};

pwdNode.onkeyup = () => {
  const pwdValue = pwdNode.value;

  if (pwdValue && pwdNode.classList.contains(errorFieldClass)) {
    pwdNode.classList.remove(errorFieldClass);
  }
};

signInBtn.onclick = async () => {
  const emailValue = emailNode.value;
  const pwdValue = pwdNode.value;

  if (!emailValue || !pwdValue) {
    alert('Please enter email and password');

    if (!emailValue) {
      emailNode.classList.add(errorFieldClass);
    }

    if (!pwdValue) {
      pwdNode.classList.add(errorFieldClass);
    }

    return;
  }

  try {
    const { uid } = await postData(`${API_ENDPOINT}/signin/email-pwd`, {
      email: emailValue,
      password: pwdValue,
    });

    const { displayName } = await getData(
      `${API_ENDPOINT}/signin/retrieve-acc-info`,
      {
        uid,
      }
    );

    const { accessToken, refreshToken, expiredTime } = await postData(
      `${API_ENDPOINT}/auth/create-token`,
      {
        uid,
      }
    );

    localStorage.setItem(
      ExtensionLocalStorageConstant.DISPLAY_NAME,
      displayName
    );
    localStorage.setItem(ExtensionLocalStorageConstant.IS_SIGNED_IN, true);
    localStorage.setItem(ExtensionLocalStorageConstant.UID, uid);

    await setDisplayName(displayName);
    await setAccessToken(accessToken);
    await setRefreshToken(refreshToken);
    await setExpiredTimeToken(expiredTime);

    window.location.href = 'toggle.html';
  } catch (err) {
    console.error(err);
    alert('Invalid username/password');
  }
};
