import React from 'react';
import { matchTweetVerification } from '../../Util/API/VerificationAPI';
import { RouteConstant } from '../../Util/Constant/RouteConstant';
import StepTwo from '../Template/StepTwo';

const VerifyStepTwo: React.FC = () => {
  const handleMatchTweet = async () => {
    return await matchTweetVerification();
  };

  return (
    <StepTwo
      nextUrl={RouteConstant.SECURE_VERIFTY_STEP_THREE}
      onMatchTweet={handleMatchTweet}
    />
  );
};

export default VerifyStepTwo;
