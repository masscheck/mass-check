const signInBtn = document.getElementById('signin');
const emailNode = document.getElementById('email');
const pwdNode = document.getElementById('password');

const errorFieldClass = 'error-field';

emailNode.onkeyup = () => {
  const emailValue = emailNode.value;

  if (emailValue && emailNode.classList.contains(errorFieldClass)) {
    emailNode.classList.remove(errorFieldClass);
  }
};

pwdNode.onkeyup = () => {
  const pwdValue = pwdNode.value;

  if (pwdValue && pwdNode.classList.contains(errorFieldClass)) {
    pwdNode.classList.remove(errorFieldClass);
  }
};

signInBtn.onclick = () => {
  const emailValue = emailNode.value;
  const pwdValue = pwdNode.value;

  if (!emailValue || !pwdValue) {
    alert('Please enter email and password');

    if (!emailValue) {
      emailNode.classList.add(errorFieldClass);
    }

    if (!pwdValue) {
      pwdNode.classList.add(errorFieldClass);
    }

    return;
  }

  // window.location.href = 'toggle.html';
};
