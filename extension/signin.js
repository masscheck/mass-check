// const firebaseConfig = {
//   apiKey: "AIzaSyAqs2Nx9kg_MEGvfjMla7ZpoSCsWtw3dNw",
//   authDomain: "masscheck-d8ece.firebaseapp.com",
//   projectId: "masscheck-d8ece",
//   storageBucket: "masscheck-d8ece.appspot.com",
//   messagingSenderId: "845650642906",
//   appId: "1:845650642906:web:2cf7c0bcf6b3d12aeba2e3"
// };

// firebase.initializeApp(firebaseConfig);

// const ui = new firebaseui.auth.AuthUI(firebase.auth());

// const uiConfig = {
//     callbacks: {
//         signInSuccessWithAuthResult: function (authResult, redirectUrl) {
//             chrome.runtime.sendMessage({ message: 'sign_in' }, function (response) {
//                 if (response.message === 'success') {
//                     window.location.replace('./toggle.html');
//                 }
//             });
//             return false;
//         },
//         uiShown: function () {
//             document.getElementById('sign_in').style.display = 'none';
//             document.getElementById('wrapper').style.pointerEvents = 'none';
//         }
//     },
//     signInFlow: 'popup',
//     // signInSuccessUrl: '<url-to-redirect-to-on-success>',
//     signInOptions: [
//         // Leave the lines as is for the providers you want to offer your users.
//         firebase.auth.EmailAuthProvider.PROVIDER_ID,
//     ],
//     // Terms of service url.
//     // tosUrl: '<your-tos-url>',
//     // Privacy policy url.
//     // privacyPolicyUrl: '<your-privacy-policy-url>'
// };

// document.querySelector('#wrapper').addEventListener('click', () => {
//     ui.start('#sign_in_options', uiConfig);
// });

// document.querySelector('#wrapper').addEventListener('mouseover', () => {
//     let sign_in = document.querySelector('#my_sign_in');
//     sign_in.classList.remove('sign_in_no_hover');
//     sign_in.classList.add('sign_in_hover');
// });

// document.querySelector('#wrapper').addEventListener('mouseleave', () => {
//     let sign_in = document.querySelector('#my_sign_in');
//     sign_in.classList.remove('sign_in_hover');
//     sign_in.classList.add('sign_in_no_hover');
// });