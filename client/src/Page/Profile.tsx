import React, { useEffect, useState } from 'react';
import './Profile.scss';
import Activity from '../Component/Activity';

import { useNotification } from '../Context/NotificationContext';
import { LocalStorageEnum } from '../Util/Constant/LocalStorageEnum';
import { getUserCredibilityScore } from '../Util/API/UserProfileAPI';

const Profile: React.FC = () => {
  const { errorToastPersistent } = useNotification();
  const uid = localStorage.getItem(LocalStorageEnum.UID);
  const [CredibilityScore, setCredibilityScore] = useState(0);

  useEffect(() => {
    async function loadUserCredibilityScore(uid) {
      const userCredibilityScore = await getUserCredibilityScore(uid);
      setCredibilityScore(userCredibilityScore.data['credibilityScore']);
    }
    loadUserCredibilityScore(uid);
  }, [uid]);

  return (
    <div className='profile'>
      <div className='profile__top'>
        <div className='profile__top__wallet'>
          <div className='profile__top__wallet__title'>My Wallet</div>
          <div className='profile__top__wallet__content'>
            <div className='profile__top__wallet__content__left'>
              <div>XPX Balance </div>
              <img src={require(`../Asset/proximax.png`).default} />
              <br />
              <div className='profile__top__wallet__content__left__amount'>
                100
              </div>
            </div>
            <div className='profile__top__wallet__content__right'>
              <button className='profile__top__wallet__content__right__button'>
                View in Wallet
              </button>
            </div>
          </div>
        </div>
        <div className='profile__top__credibility'>
          <div className='profile__top__credibility__title'>My Credibility</div>
          <div className='profile__top__credibility__score'>
            <div>Credibility Score</div>
            <br />
            <div className='profile__top__credibility__score__value'>
              {CredibilityScore}/100
            </div>
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
