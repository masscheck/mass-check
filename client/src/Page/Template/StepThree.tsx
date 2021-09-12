import { useHistory } from 'react-router-dom';

import CountdownTimer from '../../Component/CountdownTimer';
import { useTweetModel } from '../../Context/InvestigationContext';
import { TweetModel } from '../../Model/TweetModel';
import { RouteConstant } from '../../Util/Constant/RouteConstant';

import './StepThree.scss';

const StepThree = ({ nextUrl, role, onRetrieveTweetInfo }) => {
  const history = useHistory();
  const { tweetModel, setTweetModel } = useTweetModel();

  const onClickYes = () => {
    onRetrieveTweetInfo().then((res) => {
      if (role === 'investigating') {
        setTweetModel({ ...tweetModel, ...res.data });
      }

      history.push(nextUrl);
    });
  };

  const onClickNo = () => {
    history.push(RouteConstant.SECURE_HOME);
  };

  return (
    <div className='step-three'>
      <div className='step-three__image'></div>
      <div className='step-three__description'>
        <p>You have been matched with a news tweet!</p>
        <p>
          {`Would you like to start ${role}?`} <br /> You have &nbsp;
          {/* Would you like to start investigating? <br /> You have &nbsp; */}
          <CountdownTimer
            hoursMinSecs={{ hours: 0, minutes: 0, seconds: 60 }}
            isHour={false}
          />
          &nbsp; left to decide.
        </p>
      </div>
      <div className='step-three__timer'></div>
      <div className='step-three__small-description'>
        <br />
        <p>You will only be revealed the news content if you pick Yes.</p>
      </div>
      <button className='step-three__yes-button' onClick={onClickYes}>
        Yes
      </button>
      <button className='step-three__no-button' onClick={onClickNo}>
        No
      </button>
    </div>
  );
};

export default StepThree;
