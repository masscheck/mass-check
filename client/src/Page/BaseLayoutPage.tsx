import React, { useEffect } from 'react';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';

import { useNotification } from '../Context/NotificationContext';
import { useLoadingSpinner } from '../Context/LoadingSpinnerContext';

import NavBarSelection from '../Component/NavBar/NavBarSelection';
import Header from '../Component/Header';
import RoutingPath from '../Component/Routing';

import { hasValidTokenAccess } from '../Util/Useful/AuthUser';
import { RouteConstant } from '../Util/Constant/RouteConstant';
import { LocalStorageEnum } from '../Util/Constant/LocalStorageEnum';

import './BaseLayoutPage.scss';

const BaseLayoutPage: React.FC = () => {
  const { setIsLoading } = useLoadingSpinner();
  const history = useHistory();
  const { errorToastPersistent } = useNotification();

  useEffect(() => {
    console.log('Check user session');
    const isSignIn = localStorage.getItem(LocalStorageEnum.IS_SIGN_IN);

    if (isSignIn) {
      (async () => {
        setIsLoading(true);
        const [hasValidToken, hasSignOut] = await hasValidTokenAccess();
        setIsLoading(false);

        if (hasValidToken) {
          history.push(RouteConstant.SECURE_HOME);
        } else {
          if (!hasSignOut) {
            errorToastPersistent('Session Timeout. Please Sign In Again.');
          }
          history.push(RouteConstant.PUBLIC_SIGN_IN);
        }
      })();
    }
  }, []);

  return (
    <Router>
      <div className='base-layout'>
        <div className='nav-bar'>
          <NavBarSelection />
        </div>
        <div className='header'>
          <Header />
        </div>
        <div className='content'>
          <RoutingPath />
        </div>
      </div>
    </Router>
  );
};

export default BaseLayoutPage;
