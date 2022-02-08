import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Joi from 'joi';

import { useLoadingSpinner } from '../Context/LoadingSpinnerContext';
import { useNotification } from '../Context/NotificationContext';
import { useAuth } from '../Context/AuthContext';
import { RouteConstant } from '../Util/Constant/RouteConstant'

import './ResetPassword.scss';

const emailSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
});

interface validationErrorInterface {
  email?: string;
}

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [hasNoError, setHasNoError] = useState(false);
  const { successToast, errorToast, warnToast } = useNotification();
  const [validationError, setValidationError] =
    useState<validationErrorInterface>({});
  const { resetPassword } = useAuth();
  const history = useHistory();
  const { setIsLoading } = useLoadingSpinner();

  useEffect(() => {
    setHasNoError(!!email);
  }, [email]);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const hasFormContainsErrors = () => {
    const validated = emailSchema.validate({ email }, { abortEarly: false });

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
      await resetPassword(email);

      successToast('Reset Password Succesfully. Please check your inbox.');
      history.push(RouteConstant.PUBLIC_SIGN_IN);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        errorToast('Reset Password Failed. Email not found.');
      } else {
        errorToast('Reset Password Failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className='sign-in__form'
      onSubmit={(e) => onEmailSignIn(e)}
      noValidate
    >
      <div className='background'>
        <img src={require(`../Asset/Background.png`).default} />
      </div>
      <div className='masscheck-glow'>
        <img src={require(`../Asset/Logo-White-Glow.png`).default} />
      </div>
      <div>
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
      <button
        type='submit'
        className='sign-in__form__submit-btn'
        disabled={!hasNoError}
      >
        Reset Password
      </button>
    </form>
  );
};

export default ResetPassword;
