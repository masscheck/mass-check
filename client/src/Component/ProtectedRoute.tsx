import { Route, Redirect } from 'react-router-dom';
import { useAccountInfo } from '../Context/AccountInfoContext';

import { RouteConstant } from '../Util/Constant/RouteConstant';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const {
    accountInfo: { toSecureAllowable },
  } = useAccountInfo();

  return (
    <Route
      {...rest}
      render={(props) => {
        return toSecureAllowable ? (
          <Component {...props} />
        ) : (
          <Redirect to={RouteConstant.PUBLIC_SIGN_IN} />
        );
      }}
    ></Route>
  );
};

export default ProtectedRoute;
