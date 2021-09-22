import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { RouteConstant } from '../../Util/Constant/RouteConstant';
import { useNotification } from '../../Context/NotificationContext';

import './NavBarPublic.scss';
import { useAccountInfo } from '../../Context/AccountInfoContext';

const NavBar: React.FC = (props: any) => {
  const { pathname } = useLocation();
  const {
    accountInfo: { toSignUpSuccessAllowable },
  } = useAccountInfo();
  const { warnToast } = useNotification();

  const onNext = (event) => {
    if (toSignUpSuccessAllowable) {
      event.preventDefault();
      warnToast('Please Complete Sign-Up Application Before Proceeding');
    }
  };

  return (
    <div className='nav-bar-container'>
      <h1>Mass Check</h1>
      <div className='flex-container'>
        <div className='nav-link-list'>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            isActive={() =>
              [
                RouteConstant.PUBLIC_SIGN_IN,
                RouteConstant.PUBLIC_RESET_PASSWORD,
              ].includes(pathname)
            }
            to={RouteConstant.PUBLIC_SIGN_IN}
            onClick={onNext}
          >
            Sign In
          </NavLink>
          <NavLink
            className={'nav-link'}
            activeClassName='nav-link-active'
            isActive={() =>
              [
                RouteConstant.PUBLIC_SIGN_UP,
                RouteConstant.PUBLIC_SIGN_UP_SUCCESS,
              ].includes(pathname)
            }
            to={RouteConstant.PUBLIC_SIGN_UP}
            onClick={onNext}
          >
            Sign Up
          </NavLink>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            to={RouteConstant.PUBLIC_FAQ}
            onClick={onNext}
          >
            FAQ
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
