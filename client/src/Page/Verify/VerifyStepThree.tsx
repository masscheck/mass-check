import React from 'react';
import { RouteConstant } from '../../Util/Constant/RouteConstant';

import StepThree from '../Template/StepThree';

const VerifyStepThree: React.FC = () => {
  return (
    <StepThree
      nextUrl={RouteConstant.SECURE_VERIFTY_STEP_FOUR}
      role='jury'
      onRetrieveTweetInfo={null}
    />
  );
};

export default VerifyStepThree;
