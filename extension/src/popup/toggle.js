const MessageConstant = {
  ACTIVATE_MASSCHECK: 'ACTIVATE_MASSCHECK',
  DEACTIVATE_MASSCHECK: 'DEACTIVATE_MASSCHECK',
  EXT_MASSCHECK_INTERFACE_STATE: 'EXT_MASSCHECK_INTERFACE_STATE',
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
