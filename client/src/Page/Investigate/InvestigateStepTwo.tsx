import React from 'react';
import { RouteConstant } from '../../Util/Constant/RouteConstant';
import StepTwo from '../Template/StepTwo';

const InvestigateStepTwo: React.FC = () => {
  return <StepTwo nextUrl={RouteConstant.SECURE_INVESTIGATE_STEP_THREE} />;
};

export default InvestigateStepTwo;
