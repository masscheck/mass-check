import React, { useEffect } from 'react';
import { NavLink, useLocation, useHistory } from 'react-router-dom';

import { useAuth } from '../../Context/AuthContext';
import { useNotification } from '../../Context/NotificationContext';
import { RouteConstant } from '../../Util/Constant/RouteConstant';

import './NavBarSecure.scss';
import { useAccountInfo } from '../../Context/AccountInfoContext';
import { AccountModel } from '../../Model/AccountModel';
import { getAuth, postDeleteToken } from '../../Util/API/AuthAPI';
import { LocalStorageEnum } from '../../Util/Constant/LocalStorageEnum';

const NavBarHome: React.FC = () => {
  const { signOut } = useAuth();
  const { warnToast, successToast } = useNotification();
  const {
    accountInfo: { displayName },
    setAccountInfo,
  } = useAccountInfo();
  const { pathname } = useLocation();
  const history = useHistory();

  useEffect(() => {
    console.log({ pathname });
    if (pathname.includes('secure')) {
      (async () => {
        try {
          await getAuth();
        } catch (error) {
          setAccountInfo(new AccountModel());
          localStorage.clear();

          warnToast('Session has expired!');
          history.push(RouteConstant.PUBLIC_SIGN_IN);
        }
      })();
    }
  }, [pathname]);

  const onSignOut = async () => {
    const refreshToken = localStorage.getItem(LocalStorageEnum.REFRESH_TOKEN);
    await postDeleteToken(refreshToken);
    setAccountInfo(new AccountModel());
    localStorage.clear();

    signOut();

    successToast('Sign Out Successfully');
    history.push(RouteConstant.PUBLIC_SIGN_IN);
  };

  const onNext = (event) => {
    if (pathname.includes('step-three') || pathname.includes('step-four')) {
      event.preventDefault();
      warnToast('Please complete your current task');
      return;
    }
  };

  return (
    <div className='nav-bar-home-container'>
      <div className='flex-container'>
        <h1>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            exact
            to={RouteConstant.SECURE_PROFILE}
            onClick={onNext}
          >
            {displayName}
          </NavLink>
        </h1>
        <div className='nav-link-list'>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            exact
            to={RouteConstant.SECURE_HOME}
            onClick={onNext}
          >
            <img src={require(`../../Asset/Home.png`).default} />
            Home
          </NavLink>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            isActive={() =>
              [
                RouteConstant.SECURE_INVESTIGATE_STEP_ONE,
                RouteConstant.SECURE_INVESTIGATE_STEP_TWO,
                RouteConstant.SECURE_INVESTIGATE_STEP_THREE,
                RouteConstant.SECURE_INVESTIGATE_STEP_FOUR,
                RouteConstant.SECURE_INVESTIGATE_STEP_FIVE,
              ].includes(pathname)
            }
            to={RouteConstant.SECURE_INVESTIGATE_STEP_ONE}
            onClick={onNext}
          >
            <img src={require(`../../Asset/Magnifying-Glass.png`).default} />
            Investigate
          </NavLink>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            isActive={() =>
              [
                RouteConstant.SECURE_VERIFTY_STEP_ONE,
                RouteConstant.SECURE_VERIFTY_STEP_TWO,
                RouteConstant.SECURE_VERIFTY_STEP_THREE,
                RouteConstant.SECURE_VERIFTY_STEP_FOUR,
                RouteConstant.SECURE_VERIFTY_STEP_FIVE,
              ].includes(pathname)
            }
            to={RouteConstant.SECURE_VERIFTY_STEP_ONE}
            onClick={onNext}
          >
            <img src={require(`../../Asset/Check.png`).default} />
            Verify
          </NavLink>
        </div>
        <div className='nav-link-list'>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            to={RouteConstant.SECURE_FAQ}
            onClick={onNext}
          >
            <img src={require(`../../Asset/FAQ.png`).default} />
            FAQ
          </NavLink>
          <button className='nav-link button' onClick={onSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBarHome;
