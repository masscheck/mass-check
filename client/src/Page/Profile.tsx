import React, { useEffect, useState } from 'react';
import './Profile.scss';
import Activity from '../Component/Activity';

import { useNotification } from '../Context/NotificationContext';
import { useAccountInfo } from '../Context/AccountInfoContext';
import { getAccountInfo, getXpxBalance } from '../Util/API/UserProfileAPI';
import { useLoadingSpinner } from '../Context/LoadingSpinnerContext';
import { ActivityModel } from '../Model/ActivityModel';

const Profile: React.FC = () => {
  const { errorToastPersistent } = useNotification();
  const {
    accountInfo: { uid, xpxAddress },
  } = useAccountInfo();
  const { setIsLoading } = useLoadingSpinner();

  const [credibilityScore, setCredibilityScore] = useState(0);
  const [xpxBalance, setXpxBalance] = useState(0);
  const [activityList, setActivityList] = useState<ActivityModel[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Get proximax
      const userXpxBalance = await getXpxBalance(xpxAddress);
      setXpxBalance(userXpxBalance);

      // Account Info
      const accountInfo = await getAccountInfo(uid);

      const { userCredibilityScore } = accountInfo;
      setCredibilityScore(userCredibilityScore);

      // Set Activity
      const tweetActivityList = [];
      const { investigatedTweets, verifiedTweets, forfeitedTweets } = accountInfo;

      investigatedTweets.map((element) => {
        const { xpxReward, credibilityScoreReward, _id } = element;

        tweetActivityList.push({
          xpxReward,
          credibilityScoreReward,
          ..._id,
          role: 'Investigator',
        });
      });

      verifiedTweets.map((element) => {
        const { xpxReward, credibilityScoreReward, _id } = element;

        tweetActivityList.push({
          xpxReward,
          credibilityScoreReward,
          ..._id,
          role: 'Jury',
        });
      });

      forfeitedTweets.map((element) => {
        const { xpxReward, credibilityScoreReward, _id } = element;

        tweetActivityList.push({
          xpxReward,
          credibilityScoreReward,
          ..._id,
          role: 'Forfeited',
        });
      });

      setActivityList(tweetActivityList);
    } catch (err) {
      console.error(err);
      errorToastPersistent(
        'Unexpected error has occured. Please refresh the page or contact MassCheck Developer'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const goToXpxWallet = () => {
    window.open('https://bctestnetwallet.xpxsirius.io/#/home', '_blank');
  };

  return (
    <div className='profile'>
      <div className='profile__top'>
        <div className='profile__top__wallet'>
          <div className='profile__top__wallet__title'>My Wallet</div>
          <div className='profile__top__wallet__content'>
            <div className='profile__top__wallet__content__left'>
              <div className='profile__top__wallet__content__left__title'>
                <div>XPX Balance </div>
                <img src={require(`../Asset/proximax.png`).default} />
              </div>
              <br />
              <div className='profile__top__wallet__content__left__amount'>
                {xpxBalance}
              </div>
            </div>
            <div className='profile__top__wallet__content__right'>
              <button
                className='profile__top__wallet__content__right__button'
                onClick={goToXpxWallet}
              >
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
              {credibilityScore}/100
            </div>
          </div>
        </div>
      </div>
      <div className='profile__activity'>
        <Activity activityList={activityList} />
      </div>
    </div>
  );
};

export default Profile;
