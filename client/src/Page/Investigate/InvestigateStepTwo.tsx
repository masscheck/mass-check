import React from 'react';
import { RouteConstant } from '../../Util/Constant/RouteConstant';
import StepTwo from '../Template/StepTwo';
import { getInvestigationJob } from '../../Util/API/InvestigationAPI';
import { useAccountInfo } from '../../Context/AccountInfoContext';
import { useTweetModel } from '../../Context/InvestigationContext';

const InvestigateStepTwo: React.FC = () => {
  const {
    accountInfo: { uid },
  } = useAccountInfo();
  const { setTweetModel, tweetModel } = useTweetModel();

  const handleMatchTweet = async () => {
    return new Promise(async (resolve, reject) => {
      const tweetInfo = await getInvestigationJob(uid);
      setTweetModel(tweetInfo);

      resolve('Done');
    });
  };

  return (
    <StepTwo
      nextUrl={RouteConstant.SECURE_INVESTIGATE_STEP_THREE}
      onMatchTweet={handleMatchTweet}
    />
  );
};

export default InvestigateStepTwo;
