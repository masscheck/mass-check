import React from 'react';
import { RouteConstant } from '../../Util/Constant/RouteConstant';
import StepTwo from '../Template/StepTwo';
import { matchTweetInvestigation } from '../../Util/API/InvestigationAPI';

const InvestigateStepTwo: React.FC = () => {
  const handleMatchTweet = async () => {
    return await matchTweetInvestigation();
  };

  return (
    <StepTwo
      nextUrl={RouteConstant.SECURE_INVESTIGATE_STEP_THREE}
      onMatchTweet={handleMatchTweet}
    />
  );
};

export default InvestigateStepTwo;
