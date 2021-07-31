import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import NavBarSelection from '../Component/NavBarSelection';
import Header from '../Component/Header';
import RoutingPath from '../Component/Routing';

import './BaseLayoutPage.scss';

const BaseLayoutPage: React.FC = () => {
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
