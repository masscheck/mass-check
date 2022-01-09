console.log('Load content script');

// declare constant
const MessageConstant = {
  ACTIVATE_MASSCHECK: 'activate_masscheck',
  DEACTIVATE_MASSCHECK: 'deactivate_masscheck',
};

const appendMassCheckInterface = () => {
  console.log('appending masscheck interface');
};

// Chrome API
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('content script receiving message', { message });

  const messageType = message.type;

  if (MessageConstant.ACTIVATE_MASSCHECK === messageType) {
    appendMassCheckInterface();
  }

  if (message.greeting === 'hello') sendResponse({ farewell: 'goodbye' });
});
