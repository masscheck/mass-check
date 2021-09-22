import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './ProtectedRoute';

import { useAccountInfo } from '../Context/AccountInfoContext';
import { RouteConstant } from '../Util/Constant/RouteConstant';

import Home from '../Page/Home';
import SignUp from '../Page/SignUp';
import SignIn from '../Page/SignIn';
import SignUpSuccess from '../Page/SignUpSuccess';
import ResetPassword from '../Page/ResetPassword';
import Faq from '../Page/Faq';
import Profile from '../Page/Profile';
import Error404 from '../Page/Error404';
import InvestigateStepOne from '../Page/Investigate/InvestigateStepOne';
import InvestigateStepTwo from '../Page/Investigate/InvestigateStepTwo';
import InvestigateStepThree from '../Page/Investigate/InvestigateStepThree';
import InvestigateStepFour from '../Page/Investigate/InvestigateStepFour';
import InvestigateStepFive from '../Page/Investigate/InvestigateStepFive';
import VerifyStepOne from '../Page/Verify/VerifyStepOne';
import VerifyStepTwo from '../Page/Verify/VerifyStepTwo';
import VerifyStepThree from '../Page/Verify/VerifyStepThree';
import VerifyStepFour from '../Page/Verify/VerifyStepFour';
import VerifyStepFive from '../Page/Verify/VerifyStepFive';

const Routing: React.FC = () => {
  const {
    accountInfo: { toSignUpSuccessAllowable },
  } = useAccountInfo();

  return (
    <Switch>
      {toSignUpSuccessAllowable && (
        <PrivateRoute
          exact
          path={RouteConstant.PUBLIC_SIGN_UP_SUCCESS}
          component={SignUpSuccess}
        />
      )}
      <Route exact path={RouteConstant.PUBLIC_SIGN_UP} component={SignUp} />
      <Route exact path={RouteConstant.PUBLIC_SIGN_IN} component={SignIn} />
      <Route
        exact
        path={RouteConstant.PUBLIC_RESET_PASSWORD}
        component={ResetPassword}
      />
      <Route
        exact
        path={[RouteConstant.PUBLIC_FAQ, RouteConstant.SECURE_FAQ]}
        component={Faq}
      />
      <Route exact path={RouteConstant.SECURE_PROFILE} component={Profile} />
      <PrivateRoute
        exact
        path={[RouteConstant.SECURE_HOME, '/']}
        component={Home}
      />
      <PrivateRoute
        exact
        path={RouteConstant.SECURE_INVESTIGATE_STEP_ONE}
        component={InvestigateStepOne}
      />
      <PrivateRoute
        exact
        path={RouteConstant.SECURE_INVESTIGATE_STEP_TWO}
        component={InvestigateStepTwo}
      />
      <PrivateRoute
        exact
        path={RouteConstant.SECURE_INVESTIGATE_STEP_THREE}
        component={InvestigateStepThree}
      />
      <PrivateRoute
        exact
        path={RouteConstant.SECURE_INVESTIGATE_STEP_FOUR}
        component={InvestigateStepFour}
      />
      <PrivateRoute
        exact
        path={RouteConstant.SECURE_INVESTIGATE_STEP_FIVE}
        component={InvestigateStepFive}
      />

      <PrivateRoute
        exact
        path={RouteConstant.SECURE_VERIFTY_STEP_ONE}
        component={VerifyStepOne}
      />
      <PrivateRoute
        exact
        path={RouteConstant.SECURE_VERIFTY_STEP_TWO}
        component={VerifyStepTwo}
      />
      <PrivateRoute
        exact
        path={RouteConstant.SECURE_VERIFTY_STEP_THREE}
        component={VerifyStepThree}
      />
      <PrivateRoute
        exact
        path={RouteConstant.SECURE_VERIFTY_STEP_FOUR}
        component={VerifyStepFour}
      />
      <PrivateRoute
        exact
        path={RouteConstant.SECURE_VERIFTY_STEP_FIVE}
        component={VerifyStepFive}
      />
      <Route component={Error404} />
    </Switch>
  );
};
export default Routing;
