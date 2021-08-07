import React, { useState, useEffect } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import Joi from 'joi';

import { useAuth } from '../Context/AuthContext';
import { useNotification } from '../Context/NotificationContext';
import { useLoadingSpinner } from '../Context/LoadingSpinnerContext';

import { postCreateAcc } from '../Util/API/SignUpAPI';
import { getUserInfoByUid } from '../Util/API/NavBarHomeAPI';
import { LocalStorageEnum } from '../Util/Constant/LocalStorageEnum';
import { SignInMethodEnum } from '../Util/Constant/SignInMethodEnum';
import { SignUpStage } from '../Util/Constant/SignUpStage';
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

  const { googleSignIn, emailSignIn, currentUser, twitterSignIn } = useAuth();
  const { successToast, errorToast, warnToast } = useNotification();
  const { setIsLoading } = useLoadingSpinner();

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
        return await googleSignIn();

      case SignInMethodEnum.TWITTER_SIGN_IN:
        return await twitterSignIn();
    }
  };

  const onExternalMethodSignIn = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    signInMethod: SignInMethodEnum
  ) => {
    e.preventDefault();
    let curStage: SignUpStage;

    setIsLoading(true);
    try {
      const { uid, email, username, isNewUser } = await onExternalCallback(
        signInMethod
      );

      if (isNewUser) {
        await postCreateAcc(uid, email, username);

        curStage = SignUpStage.MASS_CHECK_ACC_CREATED;
        localStorage.setItem(
          LocalStorageEnum.STAGE,
          SignUpStage.MASS_CHECK_ACC_CREATED
        );

        successToast('Sign Up Successfully');
      } else {
        const user = await getUserInfoByUid(uid);
        const { stage } = user.data.userInfo;
        curStage = stage;

        localStorage.setItem(LocalStorageEnum.STAGE, stage);
      }

      if (curStage === SignUpStage.MASS_CHECK_ACC_CREATED) {
        history.push(RouteConstant.PUBLIC_SIGN_UP_SUCCESS);
      } else {
        history.push(RouteConstant.SECURE_HOME);
        successToast('Sign In Successfully');
      }
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        warnToast('Sign in pop up browser has closed. Please try again.');
      } else {
        errorToast(err.message);
      }
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

  const onEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (hasFormContainsErrors()) return;

    try {
      setIsLoading(true);
      await emailSignIn(email, password);

      if (
        localStorage.getItem(LocalStorageEnum.STAGE) ===
        SignUpStage.MASS_CHECK_ACC_CREATED
      ) {
        history.push(RouteConstant.PUBLIC_SIGN_UP_SUCCESS);
      } else {
        history.push(RouteConstant.SECURE_HOME);
      }

      successToast('Sign In Successfully');
    } catch (err) {
      errorToast(err.message);
    } finally {
      setIsLoading(false);
    }
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
            to='/reset-password'
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
