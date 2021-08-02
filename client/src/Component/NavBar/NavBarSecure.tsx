import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import { LocalStorageEnum } from '../../Util/Constant/LocalStorageEnum';

import { useAuth } from '../../Context/AuthContext';
import { RouteConstant } from '../../Util/Constant/RouteConstant';

import './NavBarSecure.scss';

const NavBarHome: React.FC = () => {
  const { signOut, currentUser } = useAuth();
  const [username, setUsername] = useState('LOADING...');
  const { pathname } = useLocation();

  useEffect(() => {
    setUsername(localStorage.getItem(LocalStorageEnum.DISPLAY_NAME));
  }, []);

  return (
    <div className='nav-bar-home-container'>
      <div className='flex-container'>
        <h1>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            exact
            to={RouteConstant.SECURE_PROFILE}
          >
            {username}
          </NavLink>
        </h1>
        <div className='nav-link-list'>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            exact
            to={RouteConstant.SECURE_HOME}
          >
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
          >
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
          >
            Verify
          </NavLink>
        </div>
        <div className='nav-link-list'>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            to={RouteConstant.SECURE_FAQ}
          >
            FAQ
          </NavLink>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            to={RouteConstant.PUBLIC_SIGN_IN}
            onClick={signOut}
          >
            Sign Out
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NavBarHome;
