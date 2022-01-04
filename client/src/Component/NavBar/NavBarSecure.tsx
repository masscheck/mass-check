import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { useAuth } from '../../Context/AuthContext';
import { useNotification } from '../../Context/NotificationContext';
import { RouteConstant } from '../../Util/Constant/RouteConstant';

import './NavBarSecure.scss';
import { useAccountInfo } from '../../Context/AccountInfoContext';
import { AccountModel } from '../../Model/AccountModel';

const NavBarHome: React.FC = () => {
  const { signOut } = useAuth();
  const { warnToast } = useNotification();
  const {
    accountInfo: { displayName },
    setAccountInfo,
  } = useAccountInfo();
  const { pathname } = useLocation();

  const onSignOut = () => {
    setAccountInfo(new AccountModel());
    signOut();
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
            <img src={require(`../../Asset/Home-icon.png`).default} />
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
            <img src={require(`../../Asset/Investigate-icon.png`).default} />
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
            <img src={require(`../../Asset/Verify-icon.png`).default} />
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
            <img src={require(`../../Asset/FAQ-icon.png`).default} />
            FAQ
          </NavLink>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            to={RouteConstant.PUBLIC_SIGN_IN}
            onClick={onSignOut}
          >
            Sign Out
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NavBarHome;
