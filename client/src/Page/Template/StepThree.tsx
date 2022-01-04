import { useHistory } from 'react-router-dom';

import CountdownTimer from '../../Component/CountdownTimer';
import { RouteConstant } from '../../Util/Constant/RouteConstant';

import './StepThree.scss';

const StepThree = ({ nextUrl, process, onCancel, onAccept, iconName }) => {
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
      <div className='step-three__left'>
        <div className='step-three__left__description'>
          <p>You are matched with a Tweet!</p>
          <br />
        </div>
        <div className='step-three__left__timer'>
          <img src={require(`../../Asset/stopwatch.png`).default} />
          <CountdownTimer
            hoursMinSecs={{ hours: 1, minutes: 0, seconds: 60 }}
            isHour={false}
            onTimeOut={onCancel}
          />
        </div>
        <div className='step-three__left__small-description'>
          <br />
          <p>
            You will only be revealed the news content if you choose to proceed
          </p>
        </div>
        <button className='step-three__left__yes-button' onClick={onClickYes}>
          {`Start ${process}!`}
        </button>
        <button className='step-three__left__no-button' onClick={onClickNo}>
          I don't want to proceed
        </button>
      </div>

      <div className='step-three__image'>
        <img src={require(`../../Asset/${iconName}.png`).default} />
      </div>
    </div>
  );
};

export default StepThree;
