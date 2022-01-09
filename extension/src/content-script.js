console.log('Load content script');

const API_ENDPOINT = 'http://localhost:3500/api';

// declare constant
const MessageConstant = {
  ACTIVATE_MASSCHECK: 'ACTIVATE_MASSCHECK',
  DEACTIVATE_MASSCHECK: 'DEACTIVATE_MASSCHECK',
  EXT_MASSCHECK_INTERFACE_STATE: 'EXT_MASSCHECK_INTERFACE_STATE',
};

const hashCode = (s) => {
  let h;
  for (let i = 0; i < s.length; i++)
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;

  return Math.abs(h);
};

const appendMassCheckInterface = () => {
  console.log('appending masscheck interface');

  const tweets = document.querySelectorAll(
    'article div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-kzbkwu'
  );
  console.log({ tweets });

  for (let i = 0; i < tweets.length; i++) {
    const tweetContentNodes = tweets[i].childNodes;

    const tweetHandler = tweetContentNodes[0].innerText;
    const tweetContent = tweetContentNodes[1].innerText;
    const hashedTweetContent = hashCode(tweetContent);

    const verifyButton = document.createElement('button');
    verifyButton.textContent = 'Verify';
    verifyButton.style.cssText = 'cursor: pointer; color: blue;';
    verifyButton.classList.add('masscheck'); // unique id for masscheck element in DOM
    verifyButton.onclick = () => {
      const content = {
        id: hashedTweetContent,
        tweetContent,
        tweetHandler,
      };

      fetch(`${API_ENDPOINT}/tweet/create-tweet`, {
        method: 'POST',
        body: JSON.stringify(content),
      })
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
        .finally(() => {
          console.log('ended');
        });
    };

    tweets[i].appendChild(verifyButton);
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

// Chrome API
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('content script receiving message', { message });

  const messageType = message.type;

  if (MessageConstant.ACTIVATE_MASSCHECK === messageType) {
    appendMassCheckInterface();
  } else if (MessageConstant.DEACTIVATE_MASSCHECK === messageType) {
    removeMassCheckInterface();
  }
});
