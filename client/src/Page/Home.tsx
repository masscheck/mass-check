import React from 'react';

import { useLoadingSpinner } from '../Context/LoadingSpinnerContext';

const Home: React.FC = () => {
  const { setIsLoading } = useLoadingSpinner();

  const isLoading = () => {
    localStorage.setItem('userInfo', '{x: 3}');

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };

  return (
    <div>
      <h1>HOME PAGE</h1>
      <button onClick={() => isLoading()}>Test Loading Button</button>
    </div>
  );
};

export default Home;
