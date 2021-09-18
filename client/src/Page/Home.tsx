import React, { useState, useEffect } from 'react';

import Tweet from '../Component/Tweet';
import {
  getVerifiedTweetList,
  getUnverifiedTweetList,
} from '../Util/API/HomeAPI';

import './Home.scss';

const Home: React.FC = () => {
  const [homeState, setHomeState] = useState('verified');
  const [unverifiedTweetList, setUnverifiedTweetList] = useState([]);
  const [verifiedTweetList, setVerifiedTweetList] = useState([]);
  const [tweetListContent, setTweetListContent] = useState([]);

  // App init loading
  useEffect(() => {
    (async () => {
      await retrieveData();

      console.log('Home page load');
    })();
  }, []);

  // promise => resolve or reject (resolve, reject)
  const retrieveData = async () => {
    try {
      getUnverifiedTweetList().then((res) => {
        setUnverifiedTweetList(res.data.result);
      });
      getVerifiedTweetList().then((res) => {
        setVerifiedTweetList(res.data.result);
        setTweetListContent(verifiedTweetList);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onVerifiedSelected = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setHomeState('verified');
    setTweetListContent(verifiedTweetList);
  };

  const onUnverifiedSelected = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setHomeState('unverified');
    setTweetListContent(unverifiedTweetList);
  };

  return (
    <div className='home'>
      <div className='home__header'>
        <button
          className={
            homeState === 'verified'
              ? 'selected-verified'
              : 'deselected-verified'
          }
          onClick={(e) => onVerifiedSelected(e)}
        >
          Verified Posts
        </button>
        <button
          className={
            homeState === 'unverified'
              ? 'selected-unverified'
              : 'deselected-unverified'
          }
          onClick={(e) => onUnverifiedSelected(e)}
        >
          Unverified Posts
        </button>
      </div>
      <div className='home__view-area'>
        <div className='home__view-area__tweet'>
          {console.log(tweetListContent)}
          {tweetListContent.map((tweet, index) => {
            const {
              stage,
              submitBy,
              submitTime,
              aiScore,
              authorName,
              authorTag,
              content,
            } = tweet;

            return (
              <div className='tweet-child'>
                <Tweet
                  name={authorName}
                  tag={authorTag}
                  content={content}
                  submitBy={submitBy}
                  submitTime={submitTime}
                  authenticityScore={aiScore}
                  stage={stage}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
