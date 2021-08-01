import { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { useNotification } from '../../Context/NotificationContext';
import { useLoadingSpinner } from '../../Context/LoadingSpinnerContext';
import { hasValidTokenAccess } from '../../Util/Useful/AuthUser';
import { RouteConstant } from '../../Util/Constant/RouteConstant';

import NavBarSecure from './NavBarSecure';
import NavBarPublic from './NavBarPublic';

import './NavBarPublic.scss';

const NavBarSelection: React.FC = () => {
  const location = useLocation();

  const { setIsLoading } = useLoadingSpinner();
  const history = useHistory();
  const { errorToastPersistent } = useNotification();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const [hasValidToken, hasSignOut] = await hasValidTokenAccess();
      setIsLoading(false);

      if (hasValidToken) {
        history.push(RouteConstant.SECURE_HOME);
      } else {
        if (!hasSignOut) {
          errorToastPersistent('Session Timeout. Please Sign In Again.');
        }

        history.push(RouteConstant.PUBLIC_SIGN_IN);
      }
    })();
  }, []);

  return location.pathname.includes('secure') ? (
    <NavBarSecure />
  ) : (
    <NavBarPublic />
  );
};

export default NavBarSelection;
