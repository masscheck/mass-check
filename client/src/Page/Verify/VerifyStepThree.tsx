import React from 'react';
import { useTweetModel } from '../../Context/InvestigationContext';
import { retrieveTweetInfo } from '../../Util/API/VerificationAPI';
import { LocalStorageEnum } from '../../Util/Constant/LocalStorageEnum';
import { RouteConstant } from '../../Util/Constant/RouteConstant';

import StepThree from '../Template/StepThree';

const VerifyStepThree: React.FC = () => {
  const { tweetModel } = useTweetModel();
  const handleRetrieveTweetInfo = async () => {
    const uid = localStorage.getItem(LocalStorageEnum.UID);
    const { tweetId } = tweetModel;

    return await retrieveTweetInfo(uid, tweetId);
  };

  return (
    <StepThree
      nextUrl={RouteConstant.SECURE_VERIFTY_STEP_FOUR}
      role='jury'
      onRetrieveTweetInfo={handleRetrieveTweetInfo}
    />
  );
};

export default VerifyStepThree;
