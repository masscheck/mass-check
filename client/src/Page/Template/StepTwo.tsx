import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { RouteConstant } from '../../Util/Constant/RouteConstant';

import Gavel from '../../Asset/Gavel';
import GavelBase from '../../Asset/GavelBase';
import './StepTwo.scss';
import { useNotification } from '../../Context/NotificationContext';

const StepTwo = ({ nextUrl, onMatchTweet }) => {
  const history = useHistory();
  const { warnToast } = useNotification();

  useEffect(() => {
    setTimeout(async () => {
      const tweetInfo = await onMatchTweet();

      if (!tweetInfo) {
        history.push(RouteConstant.SECURE_HOME);
        warnToast('Currently no task is avaiable');
        return;
      }

      history.push(nextUrl);
    }, 2000);
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
