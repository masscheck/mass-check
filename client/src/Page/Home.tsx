import React, { useState, useEffect } from 'react';

import Tweet from '../Component/Tweet';
import { useLoadingSpinner } from '../Context/LoadingSpinnerContext';
import { useNotification } from '../Context/NotificationContext';
import {
  getVerifiedTweetList,
  getUnverifiedTweetList,
} from '../Util/API/HomeAPI';

import './Home.scss';

const Home: React.FC = () => {
  const [unverifiedTweetList, setUnverifiedTweetList] = useState([]);
  const [verifiedTweetList, setVerifiedTweetList] = useState([]);
  const [isVerifiedTweetView, setIsVerifiedTweetView] = useState(false);
  const [nextVerifiedTweetStartDate, setNextVerifiedTweetStartDate] =
    useState(null);
  const [nextUnverifiedTweetStartDate, setNextUnverifiedTweetStartDate] =
    useState(null);
  const { errorToast } = useNotification();
  const { setIsLoading } = useLoadingSpinner();

  // App init loading
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await retrieveData();
      setIsLoading(false);
    })();
  }, []);

  // promise => resolve or reject (resolve, reject)
  const retrieveData = async () => {
    try {
      const unverifiedTweetRes = await getUnverifiedTweetList(
        nextUnverifiedTweetStartDate
      );
      setUnverifiedTweetList(unverifiedTweetRes.unverifiedTweetList);
      setNextUnverifiedTweetStartDate(
        unverifiedTweetRes.nextUnverifiedTweetStartDate
      );

      const verifiedTweetRes = await getVerifiedTweetList(
        nextVerifiedTweetStartDate
      );
      setVerifiedTweetList(verifiedTweetRes.verifiedTweetList);
      setNextVerifiedTweetStartDate(
        verifiedTweetRes.nextVerifiedTweetStartDate
      );
    } catch (err) {
      errorToast(
        'Please sign in again. If error persist, please contact MassCheck developer.'
      );
      console.error(err);
    }
  };

  const switchTweetView = (isVerified: boolean) => {
    setIsVerifiedTweetView(isVerified);
  };

  const displayTweet = () => {
    const emptyTweetView = (
      <div className='no-tweet'>
        <img src={require('../Asset/empty.png').default} />
        <p>
          No {isVerifiedTweetView ? 'verified' : 'unverified'} Tweets to be
          found!
        </p>
      </div>
    );

    if (isVerifiedTweetView && verifiedTweetList.length === 0) {
      return emptyTweetView;
    } else if (!isVerifiedTweetView && unverifiedTweetList.length === 0) {
      return emptyTweetView;
    } else {
      return (
        isVerifiedTweetView ? verifiedTweetList : unverifiedTweetList
      ).map((tweet) => {
        const {
          _id,
          curAnalysedPhase,
          submitBy,
          submitTime,
          aiScore,
          authorName,
          authorTag,
          content,
          investigatorsId,
          jurorsId,
          eachStageRequiredUserNum,
        } = tweet;

        return (
          <div className='tweet-child' key={_id}>
            <Tweet
              name={authorName}
              tag={authorTag}
              content={content}
              submitBy={submitBy}
              submitTime={submitTime}
              authenticityScore={aiScore}
              stage={curAnalysedPhase}
              maxPhaseTotalPpl={eachStageRequiredUserNum}
              currentPhaseTotalPplList={
                curAnalysedPhase === 'Investigating'
                  ? investigatorsId
                  : jurorsId
              }
            />
          </div>
        );
      });
    }
  };

  return (
    <div className='home'>
      <div className='home__header'>
        <button
          className={`switch-tweet ${!isVerifiedTweetView && 'active'}`}
          onClick={() => switchTweetView(false)}
        >
          Unverified Tweets
        </button>
        <button
          className={`switch-tweet ${isVerifiedTweetView && 'active'}`}
          onClick={() => switchTweetView(true)}
        >
          Verified Tweets
        </button>
      </div>
      <div className='home__view-area'>
        <div className='home__view-area__tweet'>{displayTweet()}</div>
      </div>
    </div>
  );
};

export default Home;
