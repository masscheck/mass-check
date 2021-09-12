import React from 'react';
import { RouteConstant } from '../../Util/Constant/RouteConstant';
import StepTwo from '../Template/StepTwo';

const VerifyStepTwo: React.FC = () => {
  return (
    <StepTwo
      nextUrl={RouteConstant.SECURE_VERIFTY_STEP_THREE}
      onMatchTweet={null}
    />
  );
};

export default VerifyStepTwo;
