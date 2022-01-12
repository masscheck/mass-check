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

const displayName = localStorage.getItem(
  ExtensionLocalStorageConstant.DISPLAY_NAME
);
const displayNameNode = document.getElementById('display-name');
displayNameNode.innerHTML = displayName || '[UNKNOWN NAME]';

const savedIsToggle = localStorage.getItem(MessageConstant.EXT_IS_ACTIVATE);
let isToggle = savedIsToggle === 'true';

const toggleBtn = document.getElementById('toggle-btn');
toggleBtn.checked = isToggle;
toggleBtn.onclick = () => {
  isToggle = !isToggle;
  localStorage.setItem(MessageConstant.EXT_IS_ACTIVATE, isToggle);

  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    console.log('toggle -> content script');

    const message = {
      type: isToggle
        ? MessageConstant.EXT_ACTIVATE_MASSCHECK
        : MessageConstant.EXT_DEACTIVATE_MASSCHECK,
    };

    chrome.tabs.sendMessage(tabs[0].id, message);
  });
};
