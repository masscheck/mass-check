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
    let tweetContent = tweetContentNodes[1].innerText;
    tweetContent = tweetContent.replace(/(\n\d+){2,3}/g, '');
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
    let tweetContent = tweetContentNodes[1].innerText;
    tweetContent = tweetContent.replace(/(\n\d+){2,3}/g, '');
    const tweetHandlerSplitted = tweetHandler.split('\n');
    const hashedTweetContent = hashCode(tweetContent);
    const tweetAuthorName = tweetHandlerSplitted[0];
    const tweetAuthorTag = tweetHandlerSplitted[1];

    const masscheckScore = document.createElement('button');
    masscheckScore.classList.add('masscheck');

    const icon = document.createElement('img');
    icon.classList.add('score-icon');
    const scoreDesc = document.createElement('div');
    scoreDesc.classList.add('score-desc');
    const masscheckIcon = document.createElement('img');
    masscheckIcon.classList.add('masscheck-icon');
    masscheckIcon.src =
      'https://firebasestorage.googleapis.com/v0/b/masscheck-d8ece.appspot.com/o/masscheck_logo.png?alt=media&token=949e28da-158e-415e-a632-f1352c46fbb2';

    if (tweetIdInDB.includes(hashedTweetContent.toString())) {
      // investigating or verified
      console.log({ tweetContentInMassCheck });

      const { tweetInfo } = tweetContentInMassCheck;

      for (let i = 0; i < tweetInfo.length; i++) {
        const tweet = tweetInfo[i];

        if (tweet['_id'] !== hashedTweetContent.toString()) {
          continue;
        } else {
          const { curAnalysedPhase } = tweet;
          const isCompletedStage = curAnalysedPhase === 'Completed';
          icon.src = isCompletedStage
            ? 'https://firebasestorage.googleapis.com/v0/b/masscheck-d8ece.appspot.com/o/actual_result_icon.png?alt=media&token=99d941ba-d0b6-4d90-bfe6-1c1dde1d3cf1'
            : 'https://firebasestorage.googleapis.com/v0/b/masscheck-d8ece.appspot.com/o/ai_result_icon.png?alt=media&token=d58f147b-b03e-4b55-ab46-6f65f469d736';

          const note = document.createElement('span');
          const score = document.createElement('span');

          let trustIndexOrAI;

          if (isCompletedStage) {
            note.innerHTML = 'Found to be ';
            trustIndexOrAI = (tweet['trustIndex'] * 100).toFixed(1);
          } else {
            note.innerHTML = 'AI predicted ';
            trustIndexOrAI = (tweet['aiScore'] * 100).toFixed(1);
          }
          score.innerHTML = trustIndexOrAI + '% Real';

          if (trustIndexOrAI >= 70) {
            score.classList.add('high-score');
          } else if (trustIndexOrAI >= 30) {
            score.classList.add('medium-score');
          } else {
            score.classList.add('low-score');
          }

          scoreDesc.appendChild(note);
          scoreDesc.appendChild(score);
          masscheckScore.classList.add('disabled-hover');
        }
      }
    } else {
      icon.src =
        'https://firebasestorage.googleapis.com/v0/b/masscheck-d8ece.appspot.com/o/search_icon.png?alt=media&token=f6deaddd-a915-4e08-8732-1b0729fb957d';

      const verifyDesc = document.createElement('p');
      verifyDesc.innerHTML = 'Verify this Tweet';

      scoreDesc.appendChild(verifyDesc);

      masscheckScore.onclick = () => {
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
          .then((res) => {
            console.log(res);
            removeMassCheckInterface();
            appendMassCheckInterface();
          })
          .catch((err) => console.log(err))
          .finally(() => {});
      };
    }

    masscheckScore.appendChild(icon);
    masscheckScore.appendChild(scoreDesc);
    masscheckScore.appendChild(masscheckIcon);

    tweets[i].appendChild(masscheckScore);
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
  console.log('activate masscheck');
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
  } else if (MessageConstant.EXT_DEACTIVATE_MASSCHECK === messageType) {
    removeMassCheckInterface();
    deactivateMassCheck();
  }
});

init();
