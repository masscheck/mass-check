function init() {
  console.log('popup.js executed');

  chrome.runtime.sendMessage(
    { message: 'is_user_signed_in' },
    function (respone) {
      if (respone.message === 'success' && respone.payload) {
        window.location.replace('./toggle.js');
      }
    }
  );
}
