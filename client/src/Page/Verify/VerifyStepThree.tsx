import React from 'react';
import { useAccountInfo } from '../../Context/AccountInfoContext';
import { useTweetModel } from '../../Context/InvestigationContext';
import { useLoadingSpinner } from '../../Context/LoadingSpinnerContext';
import { useNotification } from '../../Context/NotificationContext';
import {
  userCancelledVerificationJob,
  userAcceptVerificationJob,
} from '../../Util/API/VerificationAPI';

import { RouteConstant } from '../../Util/Constant/RouteConstant';

import StepThree from '../Template/StepThree';

const VerifyStepThree: React.FC = () => {
  const { successToast } = useNotification();
  const {
    tweetModel: { _id },
  } = useTweetModel();
  const {
    accountInfo: { uid },
  } = useAccountInfo();
  const { setIsLoading } = useLoadingSpinner();

  const handleAccept = async () => {
    setIsLoading(true);
    return new Promise(async (resolve, reject) => {
      await userAcceptVerificationJob(uid, _id);

      setIsLoading(false);
      resolve('Success');
    });
  };

  const handleCancel = async () => {
    setIsLoading(true);
    return new Promise(async (resolve, reject) => {
      await userCancelledVerificationJob(uid, _id);
      successToast(
        'You have successfully withdrawn from the task. You will not be penalized.'
      );

      setIsLoading(false);
      resolve('Success');
    });
  };

  return (
    <StepThree
      nextUrl={RouteConstant.SECURE_VERIFTY_STEP_FOUR}
      process='verifying'
      onAccept={handleAccept}
      onCancel={handleCancel}
      iconName='Jury'
    />
  );
};

export default VerifyStepThree;
