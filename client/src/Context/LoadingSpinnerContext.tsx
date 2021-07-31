import React, { useContext, useState } from 'react';
import LoadingSpinner from '../Component/LoadingSpinner';

type LoadingSpinnerContextType = {
  setIsLoading: (isLoading: boolean) => void;
};

const LoadingSpinnerContext = React.createContext<
  Partial<LoadingSpinnerContextType>
>({});

const useLoadingSpinner = () => {
  return useContext(LoadingSpinnerContext);
};

const LoadingSpinnerProvider: React.FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const value = {
    setIsLoading,
  };

  return (
    <LoadingSpinnerContext.Provider value={value}>
      {isLoading && <LoadingSpinner />}
      {children}
    </LoadingSpinnerContext.Provider>
  );
};

export { useLoadingSpinner, LoadingSpinnerProvider };
