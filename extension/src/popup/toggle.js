const MessageConstant = {
  ACTIVATE_MASSCHECK: 'activate_masscheck',
  DEACTIVATE_MASSCHECK: 'deactivate_masscheck',
  RESPOND_SUCCESS: 'respond_success',
};

const toggleBtn = document.getElementById('toggleBtn');
let isToggle = false;

console.log(toggleBtn);

toggleBtn.onclick = () => {
  isToggle = !isToggle;

  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    console.log('toggle -> content script');

    const message = {
      type: isToggle
        ? MessageConstant.ACTIVATE_MASSCHECK
        : MessageConstant.DEACTIVATE_MASSCHECK,
    };

    chrome.tabs.sendMessage(tabs[0].id, message);
  });
};
