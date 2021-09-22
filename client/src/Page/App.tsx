import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { AuthProvider } from '../Context/AuthContext';
import { AccountInfoProvider } from '../Context/AccountInfoContext';
import { NotificationProvider } from '../Context/NotificationContext';
import { LoadingSpinnerProvider } from '../Context/LoadingSpinnerContext';
import { TweetProvider } from '../Context/InvestigationContext';

import BaseLayoutPage from './BaseLayoutPage';

import './App.scss';

const App: React.FC = () => {
  return (
    <div>
      <LoadingSpinnerProvider>
        <NotificationProvider>
          <AuthProvider>
            <AccountInfoProvider>
              <TweetProvider>
                <Router>
                  <BaseLayoutPage />
                </Router>
              </TweetProvider>
            </AccountInfoProvider>
          </AuthProvider>
        </NotificationProvider>
      </LoadingSpinnerProvider>
    </div>
  );
};

export default App;
