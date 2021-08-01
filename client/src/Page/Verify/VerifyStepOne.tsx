import React from 'react';
import { useHistory } from 'react-router-dom';

import { RouteConstant } from '../../Util/Constant/RouteConstant';
import StepOne from '../Template/StepOne';

const VerifyStepOne: React.FC = () => {
  const history = useHistory();
  const onNextPage = () => {
    history.push(RouteConstant.SECURE_VERIFTY_STEP_TWO);
  };

  return <StepOne onNextPage={onNextPage} role='Juror' iconName='Jury' />;
};

export default VerifyStepOne;
