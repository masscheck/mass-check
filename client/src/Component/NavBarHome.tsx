import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useHistory } from 'react-router-dom';

import { useAuth } from '../Context/AuthContext';
import { getUsernameByUid } from '../Util/API/NavBarHomeAPI';

import './NavBarHome.scss';

const NavBarHome: React.FC = (props: any) => {
  const { signOut, currentUser } = useAuth();
  const [username, setUsername] = useState('LOADING...');

  const loadUsername = async () => {
    setTimeout(() => {}, 5000);

    console.log('Cur user', currentUser);

    const result = await getUsernameByUid(currentUser.uid);

    setUsername(result.data.username);
  };

  const history = useHistory();

  useEffect(() => {
    loadUsername();
    history.push('/');
  }, []);

  return (
    <div className='nav-bar-home-container'>
      <div className='flex-container'>
        <h1>{username}</h1>
        <div className='nav-link-list'>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            exact
            to='/'
          >
            Home
          </NavLink>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            to='/investigate-step-one'
          >
            Investigate
          </NavLink>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            to='/verify'
          >
            Verify
          </NavLink>
        </div>
        <div className='nav-link-list'>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            to='/faq'
          >
            FAQ
          </NavLink>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            to='/sign-in'
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
