import { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { useNotification } from '../../Context/NotificationContext';
import { useLoadingSpinner } from '../../Context/LoadingSpinnerContext';
import { hasValidTokenAccess } from '../../Util/Useful/AuthUser';
import { RouteConstant } from '../../Util/Constant/RouteConstant';
import { LocalStorageEnum } from '../../Util/Constant/LocalStorageEnum';

import NavBarSecure from './NavBarSecure';
import NavBarPublic from './NavBarPublic';

import './NavBarPublic.scss';

const NavBarSelection: React.FC = () => {
  const location = useLocation();

  const hasAccessToken = localStorage.getItem(LocalStorageEnum.ACCESS_TOKEN);

  return location.pathname.includes('secure') && hasAccessToken ? (
    <NavBarSecure />
  ) : (
    <NavBarPublic />
  );
};

export default NavBarSelection;
