console.log('phase background-js');

// declare variables
let initLoading = true;

let timeoutHandle = null;
const timeoutDuration = 3000; // in milliseconds

// no more network request, send to user safe to load the page
const timeoutCallback = () => {
  if (initLoading) {
    initLoading = false;
  } else {
    // user scroll more new tweets
  }

  console.log('DOM finished loaded. can load masscheck interface');
};

// helpful function
const resetTimer = () => {
  window.clearTimeout(timeoutHandle);

  timeoutHandle = window.setTimeout(timeoutCallback, timeoutDuration);
};

// Chrome API
// check for incoming network request
chrome.webRequest.onCompleted.addListener(
  (details) => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const curUrl = tabs[0] && tabs[0].url;
      const twitterRegex = /twitter/gi;

      // only on active tab will trigger the send msg
      if (twitterRegex.test(curUrl)) {
        resetTimer();
      }
    });
  },
  {
    urls: ['<all_urls>'],
  }
);
