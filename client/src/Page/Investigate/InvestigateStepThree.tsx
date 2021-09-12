import React from 'react';

import { RouteConstant } from '../../Util/Constant/RouteConstant';
import { retrieveTweetInfo } from '../../Util/API/InvestigationAPI';
import { useTweetModel } from '../../Context/InvestigationContext';

import StepThree from '../Template/StepThree';
import { LocalStorageEnum } from '../../Util/Constant/LocalStorageEnum';

const InvestigateStepThree: React.FC = () => {
  const { tweetModel } = useTweetModel();
  const handleRetrieveTweetInfo = async () => {
    const uid = localStorage.getItem(LocalStorageEnum.UID);
    const { tweetId } = tweetModel;

    return await retrieveTweetInfo(uid, tweetId);
  };

  return (
    <StepThree
      nextUrl={RouteConstant.SECURE_INVESTIGATE_STEP_FOUR}
      role='investigating'
      onRetrieveTweetInfo={handleRetrieveTweetInfo}
    />
  );
};

export default InvestigateStepThree;
