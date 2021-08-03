import React from 'react';
import { useHistory } from 'react-router-dom';

import { LocalStorageEnum } from '../Util/Constant/LocalStorageEnum';
import { RouteConstant } from '../Util/Constant/RouteConstant';

import './Error404.scss';

const Error404: React.FC = () => {
  const history = useHistory();

  const hasToken = localStorage.getItem(LocalStorageEnum.ACCESS_TOKEN);

  const onNext = () => {
    if (hasToken) {
      history.push(RouteConstant.SECURE_HOME);
    } else {
      history.push(RouteConstant.PUBLIC_SIGN_IN);
    }
  };

  return (
    <div className='error-404'>
      <p className='error-404__oops'>Oops. Something bad happened.</p>

      <p className='error-404__description'>
        The page you're looking for doesn't exist yet, so we gave you this one
        instead. You can reach us on Twitter{' '}
        <span className='error-404__twitter'>@masscheckhelp</span> and let us
        know your problem.
      </p>
      <button className='error-404__btn' onClick={onNext}>
        {hasToken ? 'Home' : 'Sign In'}
      </button>
    </div>
  );
};

export default Error404;
