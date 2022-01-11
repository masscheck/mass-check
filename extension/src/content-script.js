console.log('Load content script');

const API_ENDPOINT = 'http://localhost:3500/api';

// declare constant
const MessageConstant = {
  ACCESS_TOKEN: 'MASSCHECK_ACCESS_TOKEN',
  REFRESH_TOKEN: 'MASSCHECK_REFRESH_TOKEN',
  EXPIRE_TIME_TOKEN: 'MASSCHECK_EXPIRE_TIME_TOKEN',
  DISPLAY_NAME: 'MASSCHECK_DISPLAY_NAME',
  EXT_ACTIVATE_MASSCHECK: 'MASSCHECK_EXT_ACTIVATE_MASSCHECK',
  EXT_DEACTIVATE_MASSCHECK: 'MASSCHECK_EXT_DEACTIVATE_MASSCHECK',
  EXT_IS_ACTIVATE: 'MASSCHECK_EXT_IS_ACTIVATE',
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
    const tweetHandlerSplitted = tweetHandler.split('\n');
    const hashedTweetContent = hashCode(tweetContent);
    const tweetAuthorName = tweetHandlerSplitted[0];
    const tweetAuthorTag = tweetHandlerSplitted[1];

    const verifyButton = document.createElement('button');
    verifyButton.textContent = 'Verify';
    verifyButton.style.cssText = 'cursor: pointer; color: blue;';
    verifyButton.classList.add('masscheck'); // unique id for masscheck element in DOM
    verifyButton.onclick = () => {
      const content = {
        id: hashedTweetContent,
        tweetContent:tweetContent,
        tweetAuthorName:tweetAuthorName,
        tweetAuthorTag: tweetAuthorTag,  
      };
      console.log(content);

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
