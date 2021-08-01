import React from 'react';

import { RouteConstant } from '../../Util/Constant/RouteConstant';

import StepThree from '../Template/StepThree';

const InvestigateStepThree: React.FC = () => {
  return <StepThree nextUrl={RouteConstant.SECURE_INVESTIGATE_STEP_FOUR} role='investigating' />;
};

export default InvestigateStepThree;
