import React, { useEffect, useState } from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';

import { RouteConstant } from '../../Util/Constant/RouteConstant';
import { useNotification } from '../../Context/NotificationContext';
import { useAccountInfo } from '../../Context/AccountInfoContext';
import { getAuth } from '../../Util/API/AuthAPI';

import './NavBarPublic.scss';
import { LocalStorageEnum } from '../../Util/Constant/LocalStorageEnum';

const NavBar: React.FC = (props: any) => {
  const { pathname } = useLocation();
  const {
    accountInfo: { toSignUpSuccessAllowable },
    setAccountInfo,
  } = useAccountInfo();
  const { warnToast } = useNotification();
  const history = useHistory();
  let token = '';

  const validateUserAuthToken = async () => {
    console.log('validate auth');

    try {
      const xpxAddress = localStorage.getItem(LocalStorageEnum.XPX_ADDRESS);

      if (!xpxAddress) {
        history.push(RouteConstant.PUBLIC_SIGN_IN);
        return;
      }

      await getAuth();

      const uid = localStorage.getItem(LocalStorageEnum.UID);
      const displayName = localStorage.getItem(LocalStorageEnum.DISPLAY_NAME);

      setAccountInfo({
        uid,
        displayName,
        xpxAddress,
        toSignUpSuccessAllowable: false,
        toSecureAllowable: true,
      });

      history.push(RouteConstant.SECURE_HOME);
    } catch (err) {
      console.error(err);
      history.push(RouteConstant.PUBLIC_SIGN_IN);
    }
  };

  useEffect(() => {
    validateUserAuthToken();

    window.addEventListener('storage', () => {
      const accessToken = localStorage.getItem(LocalStorageEnum.ACCESS_TOKEN);

      if (accessToken !== token) {
        validateUserAuthToken();
        token = accessToken;
      } else if (!accessToken) {
        history.push(RouteConstant.PUBLIC_SIGN_IN);
      }
    });
  }, []);

  const onNext = (event) => {
    if (toSignUpSuccessAllowable) {
      event.preventDefault();
      warnToast('Please Complete Sign-Up Application Before Proceeding');
    }
  };

  return (
    <div className='nav-bar-container'>
      <img src={require(`../../Asset/Logo-White-Outline.png`).default} />
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
