import { useHistory } from 'react-router-dom';

import { RouteConstant } from '../../Util/Constant/RouteConstant';

import './StepFive.scss';

const StepFive = ({ tqStatement, feedbackStatement, iconName }) => {
  const history = useHistory();
  const onHome = () => {
    history.push(RouteConstant.SECURE_HOME);
  };

  return (
    <div className='step-five'>
      <div className='step-five__left'>
        <div className='step-five__left__description'>
          <p className='step-five__left__description__p1'>{`${tqStatement}`}</p>
          <p className='step-five__left__description__p2'>{`${feedbackStatement}`}</p>
        </div>
        <button className='step-five__left__button' onClick={onHome}>
          Back to Home
        </button>
      </div>
      <div className='step-five__image'>
        <img src={require(`../../Asset/${iconName}.png`).default} />
      </div>
    </div>
  );
};

export default StepFive;
