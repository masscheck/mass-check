import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import NavBarSelection from '../Component/NavBar/NavBarSelection';
import Header from '../Component/Header';
import RoutingPath from '../Component/Routing';
import createHost from '../Util/AccessLocalStorage/StorageHost';

import './BaseLayoutPage.scss';

const BaseLayoutPage: React.FC = () => {
  useEffect(() => {
    const storageHost = createHost([
      {
        origin: 'chrome-extension',
        allowedMethods: ['get', 'set', 'remove'],
      },
      {
        origin: 'twitter',
        allowedMethods: ['get'],
      },
    ]);
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
