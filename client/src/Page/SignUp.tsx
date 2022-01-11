import React, { useState, useEffect } from 'react';
import Joi from 'joi';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../Context/AuthContext';
import { useNotification } from '../Context/NotificationContext';
import { useLoadingSpinner } from '../Context/LoadingSpinnerContext';
import { useAccountInfo } from '../Context/AccountInfoContext';

import { postCreateAcc } from '../Util/API/SignUpAPI';
import { postCreateToken } from '../Util/API/AuthAPI';
import { RouteConstant } from '../Util/Constant/RouteConstant';

import './SignUp.scss';
import { LocalStorageEnum } from '../Util/Constant/LocalStorageEnum';

const signInSchema = Joi.object({
  username: Joi.string().alphanum().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(8).max(30).required(),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')),
});
interface validationErrorInterface {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasNoError, setHasNoError] = useState(false);
  const [validationError, setValidationError] =
    useState<validationErrorInterface>({});
  const history = useHistory();
  const { signUp } = useAuth();
  const { successToast, errorToast } = useNotification();
  const { setIsLoading } = useLoadingSpinner();
  const { setAccountInfo } = useAccountInfo();

  useEffect(() => {
    setHasNoError(!!(username && email && password && confirmPassword));
  }, [username, email, password, confirmPassword]);

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const hasFormContainsErrors = () => {
    const validated = signInSchema.validate(
      { username, email, password, confirmPassword },
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

  const onEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (hasFormContainsErrors()) return;

    try {
      setIsLoading(true);
      const uid = await signUp(email, password, username);

      await postCreateAcc(uid, email, username);

      await postCreateToken(uid);

      setAccountInfo({
        uid,
        displayName: username,
        xpxAddress: null,
        toSecureAllowable: false,
        toSignUpSuccessAllowable: true,
      });
      localStorage.setItem(LocalStorageEnum.DISPLAY_NAME, username);

      history.push(RouteConstant.PUBLIC_SIGN_UP_SUCCESS);
      successToast('Sign Up Successfully');
    } catch (err) {
      errorToast(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='sign-up'>
      <div className='background'>
        <img src={require(`../Asset/Background.png`).default} />
      </div>
      <div className='masscheck-glow'>
        <img src={require(`../Asset/Logo-White-Glow.png`).default} />
      </div>
      <form
        className='sign-up__form'
        onSubmit={(e) => onEmailSignUp(e)}
        noValidate
      >
        <div>
          {/* <label htmlFor='username'>Username</label> */}
          <input
            name='username'
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => onUsernameChange(e)}
          />
          {!!validationError.username && (
            <div className='sign-up__form--error'>{`Username can't contain special characters`}</div>
          )}
        </div>
        <div>
          {/* <label htmlFor='email'>Email Address</label> */}
          <input
            name='email'
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => onEmailChange(e)}
          />
          {!!validationError.email && (
            <div className='sign-up__form--error'>{`Invalid email address`}</div>
          )}
        </div>
        <div className='sign-up__form__password-group'></div>
        <div>
          {/* <label htmlFor='password'>Password</label> */}
          <input
            name='password'
            type='password'
            placeholder='Password (8 - 30 characters)'
            value={password}
            onChange={(e) => onPasswordChange(e)}
          />
          {!!validationError.password && (
            <div className='sign-up__form--error'>{`Password should have 8 to 30 characters`}</div>
          )}
        </div>
        <div>
          {/* <label htmlFor='confirmPassword'>Confirm Password</label> */}
          <input
            name='confirmPassword'
            type='password'
            placeholder='Repeat Password'
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e)}
          />
          {!!validationError.confirmPassword && (
            <div className='sign-up__form--error'>{`Password does not match`}</div>
          )}
        </div>
        <button
          type='submit'
          className='sign-up__form__submit-btn'
          disabled={!hasNoError}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
