const RouteType = {
  PUBLIC: '/public',
  SECURE: '/secure',
};

const { PUBLIC, SECURE } = RouteType;

export const RouteConstant = {
  // Public - Haven't sign in
  PUBLIC_SIGN_IN: PUBLIC + '/sign-in',
  PUBLIC_SIGN_UP: PUBLIC + '/sign-up',
  PUBLIC_SIGN_UP_SUCCESS: PUBLIC + '/sign-up-success',
  PUBLIC_RESET_PASSWORD: PUBLIC + '/reset-password',
  PUBLIC_FAQ: PUBLIC + '/faq',

  // Secure - Has sign in
  SECURE_HOME: SECURE + '/',
  SECURE_PROFILE: SECURE + '/profile',
  SECURE_FAQ: SECURE + '/faq',
  SECURE_INVESTIGATE_STEP_ONE: SECURE + '/investigate-step-one',
  SECURE_INVESTIGATE_STEP_TWO: SECURE + '/investigate-step-two',
  SECURE_INVESTIGATE_STEP_THREE: SECURE + '/investigate-step-three',
  SECURE_INVESTIGATE_STEP_FOUR: SECURE + '/investigate-step-four',
  SECURE_INVESTIGATE_STEP_FIVE: SECURE + '/investigate-step-five',
  SECURE_VERIFTY_STEP_ONE: SECURE + '/verify-step-one',
  SECURE_VERIFTY_STEP_TWO: SECURE + '/verify-step-two',
  SECURE_VERIFTY_STEP_THREE: SECURE + '/verify-step-three',
  SECURE_VERIFTY_STEP_FOUR: SECURE + '/verify-step-four',
  SECURE_VERIFTY_STEP_FIVE: SECURE + '/verify-step-five',
};
