import { useHistory } from 'react-router-dom';

import { RouteConstant } from '../../Util/Constant/RouteConstant';

import './StepFive.scss';

const StepFive = ({ tqStatement, feedbackStatement }) => {
  const history = useHistory();
  const onHome = () => {
    history.push(RouteConstant.SECURE_HOME);
  };

  return (
    <div className='step-five'>
      <div className='step-five__description'>
        <br />
        <p>{`${tqStatement}`}</p>
        <p>{`${feedbackStatement}`}</p>
      </div>
      <button className='step-five__button' onClick={onHome}>
        Home
      </button>
    </div>
  );
};

export default StepFive;
