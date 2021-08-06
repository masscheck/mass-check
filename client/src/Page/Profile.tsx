import React from 'react';
import './Profile.scss';
import Activity from '../Component/Activity';

const Profile: React.FC = () => {
  return (
    <div className='profile'>
      <div className='profile__top'>
        <div className='profile__top__wallet'>
          <div className='profile__top__wallet__title'>My Wallet</div>
          <div className='profile__top__wallet__content'>
            <div className='profile__top__wallet__content__left'>
              <text>XPX Balance </text>
              <img src={require(`../Asset/proximax.png`).default} />
              <br/>
              <text className='profile__top__wallet__content__left__amount'>100</text>
            </div>
            <div className='profile__top__wallet__content__right'>
              <button className='profile__top__wallet__content__right__button'>View in Wallet</button>
            </div>
          </div>
        </div>
        <div className='profile__top__credibility'>
          <div className='profile__top__credibility__title'>My Credibility</div>
          <div className='profile__top__credibility__score'>
            <text >Credibility Score</text>
              <br/>
            <text className='profile__top__credibility__score__value'>25/100</text>
          </div>
        </div>
      </div>
      <div className='profile__activity'>
        <Activity />
      </div>
    </div>
  );
};

export default Profile;
