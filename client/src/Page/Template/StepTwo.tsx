import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useTweetModel } from '../../Context/InvestigationContext';

import { RouteConstant } from '../../Util/Constant/RouteConstant';
import { TweetModel } from '../../Model/TweetModel';

import Gavel from '../../Asset/Gavel';
import GavelBase from '../../Asset/GavelBase';
import './StepTwo.scss';

const StepTwo = ({ nextUrl, onMatchTweet }) => {
  const history = useHistory();
  const { setTweetModel } = useTweetModel();

  useEffect(() => {
    setTimeout(() => {
      onMatchTweet().then((res) => {
        const { tweetId } = res.data;

        const tweetModel = new TweetModel();
        tweetModel.tweetId = tweetId;
        setTweetModel(tweetModel);

        history.push(nextUrl);
      });
    }, 1000);
  }, []);

  const onCancel = () => {
    history.push(RouteConstant.SECURE_HOME);
  };

  return (
    <div className='step-two'>
      <div className='step-two__animation'>
        <Gavel />
        <GavelBase />
      </div>
      <div className='step-two__description'>
        <br />
        <p>Matching you to a news tweet...</p>
      </div>
      <button className='step-two__button' onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

export default StepTwo;
