import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { AuthProvider } from '../Context/AuthContext';
import { NotificationProvider } from '../Context/NotificationContext';
import { LoadingSpinnerProvider } from '../Context/LoadingSpinnerContext';
import { InvestigationProvider } from '../Context/InvestigationContext';

import BaseLayoutPage from './BaseLayoutPage';

import './App.scss';

const App: React.FC = () => {
  return (
    <div>
      <LoadingSpinnerProvider>
        <NotificationProvider>
          <AuthProvider>
            <InvestigationProvider>
              <Router>
                <BaseLayoutPage />
              </Router>
            </InvestigationProvider>
          </AuthProvider>
        </NotificationProvider>
      </LoadingSpinnerProvider>
    </div>
  );
};

export default App;
