import React from 'react';

import { RouteConstant } from '../../Util/Constant/RouteConstant';
import { userCancelledInvestigationJob } from '../../Util/API/InvestigationAPI';
import { useTweetModel } from '../../Context/InvestigationContext';
import { useAccountInfo } from '../../Context/AccountInfoContext';

import StepThree from '../Template/StepThree';
import { useNotification } from '../../Context/NotificationContext';
import { useLoadingSpinner } from '../../Context/LoadingSpinnerContext';

const InvestigateStepThree: React.FC = () => {
  const { successToast } = useNotification();
  const {
    tweetModel: { _id },
  } = useTweetModel();
  const {
    accountInfo: { uid },
  } = useAccountInfo();
  const { setIsLoading } = useLoadingSpinner();

  const handleCancel = async () => {
    setIsLoading(true);
    return new Promise(async (resolve, reject) => {
      await userCancelledInvestigationJob(uid, _id);
      successToast(
        'You have successfully withdrawn from the task. You will not be penalized.'
      );

      setIsLoading(false);
      resolve('Success');
    });
  };

  return (
    <StepThree
      nextUrl={RouteConstant.SECURE_INVESTIGATE_STEP_FOUR}
      role='investigating'
      onCancel={handleCancel}
    />
  );
};

export default InvestigateStepThree;
