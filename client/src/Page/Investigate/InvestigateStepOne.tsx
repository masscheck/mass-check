import React from 'react';
import { useHistory } from 'react-router-dom';

import { RouteConstant } from '../../Util/Constant/RouteConstant';

import StepOne from '../Template/StepOne';

const InvestigateStepOne: React.FC = () => {
  const history = useHistory();
  const onNextPage = () => {
    history.push(RouteConstant.SECURE_INVESTIGATE_STEP_TWO);
  };

  return <StepOne onNextPage={onNextPage} role='Investigator' iconName="Investigate" />;
};

export default InvestigateStepOne;
