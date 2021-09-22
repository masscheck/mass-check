import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAccountInfo } from '../Context/AccountInfoContext';

import { RouteConstant } from '../Util/Constant/RouteConstant';

import './Header.scss';

const Header: React.FC = () => {
  const [title, setTitle] = useState('Home');
  const location = useLocation();
  const {
    accountInfo: { toSignUpSuccessAllowable },
  } = useAccountInfo();

  useEffect(() => {
    switch (location.pathname) {
      case RouteConstant.PUBLIC_SIGN_IN:
        setTitle('Sign In');
        break;
      case RouteConstant.PUBLIC_SIGN_UP:
        setTitle('Sign Up');
        break;
      case RouteConstant.PUBLIC_SIGN_UP_SUCCESS:
        toSignUpSuccessAllowable ? setTitle('Sign Up') : setTitle('Error 404');
        break;
      case RouteConstant.PUBLIC_RESET_PASSWORD:
        setTitle('Reset Your Password');
        break;
      case RouteConstant.PUBLIC_FAQ:
      case RouteConstant.SECURE_FAQ:
        setTitle('FAQ');
        break;
      case RouteConstant.SECURE_INVESTIGATE_STEP_ONE:
        setTitle('Investigate (1/5)');
        break;
      case RouteConstant.SECURE_INVESTIGATE_STEP_TWO:
        setTitle('Investigate (2/5)');
        break;
      case RouteConstant.SECURE_INVESTIGATE_STEP_THREE:
        setTitle('Investigate (3/5)');
        break;
      case RouteConstant.SECURE_INVESTIGATE_STEP_FOUR:
        setTitle('Investigate (4/5)');
        break;
      case RouteConstant.SECURE_INVESTIGATE_STEP_FIVE:
        setTitle('Investigate (5/5)');
        break;
      case RouteConstant.SECURE_VERIFTY_STEP_ONE:
        setTitle('Verify (1/5)');
        break;
      case RouteConstant.SECURE_VERIFTY_STEP_TWO:
        setTitle('Verify (2/5)');
        break;
      case RouteConstant.SECURE_VERIFTY_STEP_THREE:
        setTitle('Verify (3/5)');
        break;
      case RouteConstant.SECURE_VERIFTY_STEP_FOUR:
        setTitle('Verify (4/5)');
        break;
      case RouteConstant.SECURE_VERIFTY_STEP_FIVE:
        setTitle('Verify (5/5)');
        break;
      case RouteConstant.SECURE_PROFILE:
        setTitle('Profile');
        break;
      case RouteConstant.SECURE_HOME:
      case '/':
        setTitle('Home');
        break;
      default:
        setTitle('Error 404');
    }
  }, [location.pathname]);

  return (
    <div className='header-container'>
      <h1>{title}</h1>
      <hr />
    </div>
  );
};

export default Header;
