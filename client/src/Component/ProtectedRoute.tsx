import { Route, Redirect } from 'react-router-dom';

import { LocalStorageEnum } from '../Util/Constant/LocalStorageEnum';
import { RouteConstant } from '../Util/Constant/RouteConstant';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return localStorage.getItem(LocalStorageEnum.IS_SIGN_IN) ? (
          <Component {...props} />
        ) : (
          <Redirect to={RouteConstant.PUBLIC_SIGN_IN} />
        );
      }}
    ></Route>
  );
};

export default ProtectedRoute;
