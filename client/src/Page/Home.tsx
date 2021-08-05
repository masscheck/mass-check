import React, { useState, useEffect } from 'react';

import { useLoadingSpinner } from '../Context/LoadingSpinnerContext';
import Tweet from '../Component/Tweet';

import './Home.scss';

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
    <div className='home'>
      <div className='home__header'>
        <button className='home__header__verified'>
          Verified Posts
        </button>
        <button className='home__header__unverified'>
          Unverified Posts
        </button>

      </div>
      <div className='home__view-area'>
       <div className='home__view-area__tweet'>
        <Tweet
          name='Jill Chenraya'
          tag='@jillcry'
          content='#Malaysia recorded a total of 2,875 new #Covid19 cases on Thursday. This is the eighth consecutive day with the number of cases above 2,000. Read more at https://bit.ly/3neKgcD'
          submitBy='Jackie Chan'
          submitTime={new Date()}
          authenticityScore={67}
          stage='Verifying'
        />
       </div>
       <div className='home__view-area__tweet'>
        <Tweet
          name='Jill Chenraya'
          tag='@jillcry'
          content='#Malaysia recorded a total of 2,875 new #Covid19 cases on Thursday. This is the eighth consecutive day with the number of cases above 2,000. Read more at https://bit.ly/3neKgcD'
          submitBy='Jackie Chan'
          submitTime={new Date()}
          authenticityScore={67}
          stage='Verifying'
        />
       </div>
       <div className='home__view-area__tweet'>
        <Tweet
          name='Jill Chenraya'
          tag='@jillcry'
          content='#Malaysia recorded a total of 2,875 new #Covid19 cases on Thursday. This is the eighth consecutive day with the number of cases above 2,000. Read more at https://bit.ly/3neKgcD'
          submitBy='Jackie Chan'
          submitTime={new Date()}
          authenticityScore={67}
          stage='Verifying'
        />
       </div>
       <div className='home__view-area__tweet'>
        <Tweet
          name='Jill Chenraya'
          tag='@jillcry'
          content='#Malaysia recorded a total of 2,875 new #Covid19 cases on Thursday. This is the eighth consecutive day with the number of cases above 2,000. Read more at https://bit.ly/3neKgcD'
          submitBy='Jackie Chan'
          submitTime={new Date()}
          authenticityScore={67}
          stage='Verifying'
        />
       </div>
      </div>
      
      <button onClick={() => isLoading()}>Test Loading Button</button>
    </div>
  );
};

export default Home;
