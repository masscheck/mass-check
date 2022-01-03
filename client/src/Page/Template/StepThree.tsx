import { useHistory } from 'react-router-dom';

import CountdownTimer from '../../Component/CountdownTimer';
import { RouteConstant } from '../../Util/Constant/RouteConstant';

import './StepThree.scss';

const StepThree = ({ nextUrl, process, onCancel, onAccept }) => {
  const history = useHistory();

  const onClickYes = async () => {
    await onAccept();
    history.push(nextUrl);
  };

  const onClickNo = async () => {
    await onCancel();
    history.push(RouteConstant.SECURE_HOME);
  };

  return (
    <div className='step-three'>
      <div className='step-three__image'></div>
      <div className='step-three__description'>
        <p>You are matched with a Tweet!</p>
        <br />
      </div>
      <div className='step-three__timer'>
        <CountdownTimer
          hoursMinSecs={{ hours: 0, minutes: 0, seconds: 60 }}
          isHour={false}
          onTimeOut={onCancel}
        />
      </div>
      <div className='step-three__small-description'>
        <br />
        <p>
          You will only be revealed the news content if you choose to proceed
        </p>
      </div>
      <button className='step-three__yes-button' onClick={onClickYes}>
        {`Start ${process}!`}
      </button>
      <button className='step-three__no-button' onClick={onClickNo}>
        I don't want to proceed
      </button>
    </div>
  );
};

export default StepThree;
