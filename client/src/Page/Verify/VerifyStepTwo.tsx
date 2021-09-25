import React from 'react';
import { useAccountInfo } from '../../Context/AccountInfoContext';
import { useTweetModel } from '../../Context/InvestigationContext';
import { getVerificationJob } from '../../Util/API/VerificationAPI';
import { RouteConstant } from '../../Util/Constant/RouteConstant';
import StepTwo from '../Template/StepTwo';

const VerifyStepTwo: React.FC = () => {
  const {
    accountInfo: { uid },
  } = useAccountInfo();
  const { setTweetModel } = useTweetModel();

  const handleMatchTweet = async () => {
    return new Promise(async (resolve, reject) => {
      const tweetInfo = await getVerificationJob(uid);
      setTweetModel(tweetInfo);

      resolve('Done');
    });
  };

  return (
    <StepTwo
      nextUrl={RouteConstant.SECURE_VERIFTY_STEP_THREE}
      onMatchTweet={handleMatchTweet}
    />
  );
};

export default VerifyStepTwo;
