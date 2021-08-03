import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { AuthProvider } from '../Context/AuthContext';
import { NotificationProvider } from '../Context/NotificationContext';
import { LoadingSpinnerProvider } from '../Context/LoadingSpinnerContext';

import BaseLayoutPage from './BaseLayoutPage';

import './App.scss';

const App: React.FC = () => {
  return (
    <div>
      <LoadingSpinnerProvider>
        <NotificationProvider>
          <AuthProvider>
            <Router>
              <BaseLayoutPage />
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </LoadingSpinnerProvider>
    </div>
  );
};

export default App;
