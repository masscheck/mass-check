import React from 'react';

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
            <BaseLayoutPage />
          </AuthProvider>
        </NotificationProvider>
      </LoadingSpinnerProvider>
    </div>
  );
};

export default App;
