import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { LocalStorageEnum } from '../../Util/Constant/LocalStorageEnum';
import { RouteConstant } from '../../Util/Constant/RouteConstant';
import io from 'socket.io-client';

import Gavel from '../../Asset/Gavel';
import GavelBase from '../../Asset/GavelBase';
import './StepTwo.scss';

const StepTwo = ({ nextUrl }) => {
  const history = useHistory();

  useEffect(() => {
    const newSocket = io('http://localhost:5000');

    return () => {
      newSocket.close();
    };
  }, []);

  const onCancel = () => {
    history.push(RouteConstant.SECURE_HOME);
  };

  // TODO Match tweet
  const matchTweet = () => {
    localStorage.setItem(LocalStorageEnum.IS_FIRST_COUNTDOWN, 'true');
    history.push(nextUrl);
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
      <button className='step-two__button' onClick={matchTweet}>
        Next
      </button>
    </div>
  );
};

export default StepTwo;
