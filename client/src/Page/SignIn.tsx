import React, { useState, useEffect } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import Joi from 'joi';

import { useAuth } from '../Context/AuthContext';
import { useNotification } from '../Context/NotificationContext';
import { useLoadingSpinner } from '../Context/LoadingSpinnerContext';
import { useAccountInfo } from '../Context/AccountInfoContext';

import { postCreateAcc } from '../Util/API/SignUpAPI';
import { getAccInfo } from '../Util/API/SignInAPI';

import { SignInMethodEnum } from '../Util/Constant/SignInMethodEnum';
import { RouteConstant } from '../Util/Constant/RouteConstant';

import './SignIn.scss';

const signInSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(8).max(30).required(),
});

interface validationErrorInterface {
  email?: string;
  password?: string;
}

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasNoError, setHasNoError] = useState(false);
  const [validationError, setValidationError] =
    useState<validationErrorInterface>({});
  const history = useHistory();

  const { googleSignIn, emailSignIn, twitterSignIn } = useAuth();
  const { successToast, errorToast, warnToast } = useNotification();
  const { setIsLoading } = useLoadingSpinner();
  const { setAccountInfo } = useAccountInfo();

  useEffect(() => {
    setHasNoError(!!(email && password));
  }, [email, password]);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onExternalCallback = async (signInMethod: SignInMethodEnum) => {
    switch (signInMethod) {
      case SignInMethodEnum.GOOGLE_SIGN_IN:
        return googleSignIn();

      case SignInMethodEnum.TWITTER_SIGN_IN:
        return twitterSignIn();
    }
  };

  const navigateToNextPage = async (uid: any, isNewUser: any) => {
    const { displayName, xpxAddress } = await getAccInfo(uid);

    if (!xpxAddress && !isNewUser) {
      // User not first time sign in but dont have xpx account
      setAccountInfo({
        uid,
        displayName,
        xpxAddress,
        toSignUpSuccessAllowable: true,
        toSecureAllowable: false,
      });

      successToast('Sign Up Successfully');
      warnToast(
        'You forgot to download XPX private key last time. Getting a new account now.'
      );
      history.push(RouteConstant.PUBLIC_SIGN_UP_SUCCESS);
    } else if (isNewUser) {
      // User first time sign in
      setAccountInfo({
        uid,
        displayName,
        xpxAddress,
        toSignUpSuccessAllowable: true,
        toSecureAllowable: false,
      });

      successToast('Sign Up Successfully');
      history.push(RouteConstant.PUBLIC_SIGN_UP_SUCCESS);
    } else {
      // User not first time sign and has xpx account
      setAccountInfo({
        uid,
        displayName,
        xpxAddress,
        toSignUpSuccessAllowable: false,
        toSecureAllowable: true,
      });

      successToast('Sign In Successfully');
      history.push(RouteConstant.SECURE_HOME);
    }
  };

  const onExternalMethodSignIn = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    signInMethod: SignInMethodEnum
  ) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const { uid, email, username, isNewUser } = await onExternalCallback(
        signInMethod
      );

      if (isNewUser) {
        await postCreateAcc(uid, email, username);
      }

      await navigateToNextPage(uid, isNewUser);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        warnToast('Sign in pop up browser has closed. Please try again.');
      } else {
        errorToast(`${err.message}. Please try again later.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (hasFormContainsErrors()) return;

    try {
      setIsLoading(true);
      const { uid, isNewUser } = await emailSignIn(email, password);

      await navigateToNextPage(uid, isNewUser);
    } catch (err) {
      errorToast(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const hasFormContainsErrors = () => {
    const validated = signInSchema.validate(
      { email, password },
      { abortEarly: false }
    );

    // Check if the validation got error
    if (!!validated.error) {
      const { details } = validated.error;

      let errorArr = details.map((element) => {
        return [element.context.key, element.message];
      });

      const constructObject = (arr) => {
        return arr.reduce((acc, val) => {
          const [key, value] = val;
          acc[key] = value;
          return acc;
        }, {});
      };

      setValidationError(constructObject(errorArr));

      errorToast('Validation Error');

      return true;
    }

    return false;
  };

  return (
    <div className='sign-in'>
      <form
        className='sign-in__form'
        onSubmit={(e) => onEmailSignIn(e)}
        noValidate
      >
        <div>
          <label htmlFor='email'>Email Address</label>
          <input
            name='email'
            type='email'
            placeholder='Email Address'
            value={email}
            onChange={(e) => onEmailChange(e)}
          />
          {!!validationError.email && (
            <div className='sign-in__form--error'>{`Invalid email address`}</div>
          )}
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            name='password'
            type='password'
            placeholder='Password (8 - 30 characters)'
            value={password}
            onChange={(e) => onPasswordChange(e)}
          />
          {!!validationError.password && (
            <div className='sign-in__form--error'>{`Password should have 8 to 30 characters`}</div>
          )}
        </div>
        {/* TODO Forget password layout need to put properly using flex */}
        <div>
          <NavLink
            className='sign-in__form__forget-password'
            to={RouteConstant.PUBLIC_RESET_PASSWORD}
          >
            I forgot my password
          </NavLink>
        </div>
        <button
          type='submit'
          className='sign-in__form__submit-btn'
          disabled={!hasNoError}
        >
          Sign In
        </button>
      </form>
      <button
        className='sign-in__google-button'
        onClick={(e) =>
          onExternalMethodSignIn(e, SignInMethodEnum.GOOGLE_SIGN_IN)
        }
      >
        Sign In with <strong>Google</strong>
      </button>
      <button
        className='sign-in__twitter-button'
        onClick={(e) =>
          onExternalMethodSignIn(e, SignInMethodEnum.TWITTER_SIGN_IN)
        }
      >
        Sign In with <strong>Twitter</strong>
      </button>
    </div>
  );
};

export default SignIn;
