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
        setTitle('Frequently Asked:');
        break;
      case RouteConstant.SECURE_FAQ:
        setTitle('FAQ');
        break;
      case RouteConstant.SECURE_INVESTIGATE_STEP_ONE:
        setTitle('Investigate');
        break;
      case RouteConstant.SECURE_INVESTIGATE_STEP_TWO:
        setTitle('Investigate');
        break;
      case RouteConstant.SECURE_INVESTIGATE_STEP_THREE:
        setTitle('Investigate');
        break;
      case RouteConstant.SECURE_INVESTIGATE_STEP_FOUR:
        setTitle('Investigate');
        break;
      case RouteConstant.SECURE_INVESTIGATE_STEP_FIVE:
        setTitle('Investigate');
        break;
      case RouteConstant.SECURE_VERIFTY_STEP_ONE:
        setTitle('Verify');
        break;
      case RouteConstant.SECURE_VERIFTY_STEP_TWO:
        setTitle('Verify');
        break;
      case RouteConstant.SECURE_VERIFTY_STEP_THREE:
        setTitle('Verify');
        break;
      case RouteConstant.SECURE_VERIFTY_STEP_FOUR:
        setTitle('Verify');
        break;
      case RouteConstant.SECURE_VERIFTY_STEP_FIVE:
        setTitle('Verify');
        break;
      case RouteConstant.SECURE_PROFILE:
        setTitle('Profile');
        break;
      case RouteConstant.SECURE_HOME:
      case '/':
        setTitle("What's New?");
        break;
      default:
        setTitle('Error 404');
    }
  }, [location.pathname]);

  return (
    <div className='header-container'>
      <h1 className=
        {title === 'Sign In' ? 'public' :
        (title ==='Sign Up' ? 'public' : 
        (title ==='Frequently Asked:' ? 'public' : 'secure')
        )
        }>{title}</h1>
    </div>
  );
};

export default Header;
