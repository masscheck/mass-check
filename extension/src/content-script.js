console.log('Load content script');

const API_ENDPOINT = 'http://localhost:3500/api';

// declare constant
const MessageConstant = {
  ACCESS_TOKEN: 'MASSCHECK_ACCESS_TOKEN',
  REFRESH_TOKEN: 'MASSCHECK_REFRESH_TOKEN',
  EXPIRE_TIME_TOKEN: 'MASSCHECK_EXPIRE_TIME_TOKEN',
  DISPLAY_NAME: 'MASSCHECK_DISPLAY_NAME',
  XPX_ADDRESS: 'MASSCHECK_XPX_ADDRESS',
  EXT_ACTIVATE_MASSCHECK: 'MASSCHECK_EXT_ACTIVATE_MASSCHECK',
  EXT_DEACTIVATE_MASSCHECK: 'MASSCHECK_EXT_DEACTIVATE_MASSCHECK',
  EXT_IS_ACTIVATE: 'MASSCHECK_EXT_IS_ACTIVATE',
  UID: 'MASSCHECK_UID',
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

const getExtIsActive = () => {
  return new Promise((resolve, reject) => {
    massCheckStorage.get(MessageConstant.EXT_IS_ACTIVATE, (err, value) => {
      try {
        resolve(value);
      } catch (err) {
        reject(err);
      }
    });
  });
};

const setExtIsInactive = () => {
  return new Promise((resolve, reject) => {
    massCheckStorage.set(
      MessageConstant.EXT_IS_ACTIVATE,
      false,
      (err, value) => {
        try {
          resolve(value);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};

const hashCode = (s) => {
  let h;
  for (let i = 0; i < s.length; i++)
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;

  return Math.abs(h);
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

const appendMassCheckInterface = async () => {
  console.log('appending masscheck interface');

  const masscheckUserDisplayName = await getDisplayName();
  const masscheckUserUid = await getUid();

  const tweets = document.querySelectorAll(
    'article div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-kzbkwu'
  );

  const hashedTweetIdList = [];
  for (let i = 0; i < tweets.length; i++) {
    const tweetContentNodes = tweets[i].childNodes;
    const tweetContent = tweetContentNodes[1].innerText;
    const hashedTweetContent = hashCode(tweetContent);

    hashedTweetIdList.push(hashedTweetContent);
  }

  let tweetContentInMassCheck;
  let tweetIdInDB = [];
  try {
    tweetContentInMassCheck = await postData(
      API_ENDPOINT + '/tweet/retrieve-tweet-info',
      { hashedTweetIdList }
    );

    if (tweetContentInMassCheck.tweetInfo) {
      tweetContentInMassCheck.tweetInfo.forEach((tweet) => {
        tweetIdInDB.push(tweet['_id']);
      });
    }
  } catch (err) {
    console.err(err);
  }

  for (let i = 0; i < tweets.length; i++) {
    const tweetContentNodes = tweets[i].childNodes;
    const tweetHandler = tweetContentNodes[0].innerText;
    const tweetContent = tweetContentNodes[1].innerText;
    const tweetHandlerSplitted = tweetHandler.split('\n');
    const hashedTweetContent = hashCode(tweetContent);
    const tweetAuthorName = tweetHandlerSplitted[0];
    const tweetAuthorTag = tweetHandlerSplitted[1];

    // TODO jason
    if (tweetIdInDB.includes(hashedTweetContent.toString())) {
      // TODO investigating / verifying
      const aiTweetScore = document.createElement('button');
      aiTweetScore.classList.add('aiScore');

      if (tweetContentInMassCheck.tweetInfo) {
        tweetContentInMassCheck.tweetInfo.forEach((tweet) => {
          if (tweet['_id'] === hashedTweetContent.toString()) {
            aiTweetScore.textContent =
              'AI predicted ' + (tweet['aiScore'] * 100).toFixed(1) + '% Real';
          }
        });
      }

      tweets[i].appendChild(aiTweetScore);
    } else {
      const verifyButton = document.createElement('button');
      verifyButton.textContent = 'Verify This Tweet';
      verifyButton.style.cssText = 'cursor: pointer; color: white;';

      verifyButton.classList.add('masscheck');
      // TODO verifying button
      verifyButton.onclick = () => {
        const content = {
          id: hashedTweetContent,
          tweetContent,
          tweetAuthorName,
          tweetAuthorTag,
          submitBy: masscheckUserDisplayName,
          submitByUid: masscheckUserUid,
        };

        fetch(`${API_ENDPOINT}/tweet/create-tweet`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(content),
        })
          .then((res) => console.log(res))
          .catch((err) => console.log(err))
          .finally(() => {});
      };
      tweets[i].appendChild(verifyButton);
    }
  }
};

const removeMassCheckInterface = () => {
  console.log('removing masscheck interface');

  const masscheckNodes = document.querySelectorAll('.masscheck');

  for (let i = 0; i < masscheckNodes.length; i++) {
    const curNode = masscheckNodes[i];
    const parentNode = curNode.parentNode;

    parentNode.removeChild(curNode);
  }
};

const activateMassCheck = () => {
  const reactRootNode = document.getElementById('react-root');

  const massCheckIcon = document.createElement('img');
  massCheckIcon.src =
    'https://firebasestorage.googleapis.com/v0/b/masscheck-d8ece.appspot.com/o/Logo-White-Glow-07.png?alt=media&token=8c33eaef-849e-4ca6-825c-dd5f6b797e8c';

  const iconContainer = document.createElement('div');
  iconContainer.appendChild(massCheckIcon);
  iconContainer.classList.add('img-container');
  iconContainer.classList.add('masscheck-floating-btn');

  const floatingButton = document.createElement('div');
  floatingButton.appendChild(iconContainer);
  floatingButton.classList.add('floating-button');

  floatingButton.onclick = () => {
    removeMassCheckInterface();

    appendMassCheckInterface();
  };

  reactRootNode.appendChild(floatingButton);
};

const deactivateMassCheck = async () => {
  const masscheckFloatingBtn = document.querySelector(
    '.masscheck-floating-btn'
  );

  const parentNode = masscheckFloatingBtn.parentNode;

  parentNode.removeChild(masscheckFloatingBtn);

  await setExtIsInactive();
};

// if extension interface is active
const init = async () => {
  const isActive = await getExtIsActive();

  if (isActive === 'true') {
    activateMassCheck();
  }
};

// Chrome API
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('content script receiving message', { message });

  const messageType = message.type;

  if (MessageConstant.EXT_ACTIVATE_MASSCHECK === messageType) {
    activateMassCheck();
    // appendMassCheckInterface();
  } else if (MessageConstant.EXT_DEACTIVATE_MASSCHECK === messageType) {
    removeMassCheckInterface();
    deactivateMassCheck();
  }
});

init();
