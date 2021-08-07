import { useLocation } from 'react-router-dom';

import { LocalStorageEnum } from '../../Util/Constant/LocalStorageEnum';
import { hasTokenExpire } from '../../Util/Useful/CheckTokenExpiration';

import NavBarSecure from './NavBarSecure';
import NavBarPublic from './NavBarPublic';

import './NavBarPublic.scss';

const NavBarSelection: React.FC = () => {
  const location = useLocation();

  const hasAccessToken = localStorage.getItem(LocalStorageEnum.ACCESS_TOKEN);

  return location.pathname.includes('secure') &&
    hasAccessToken &&
    !hasTokenExpire() ? (
    <NavBarSecure />
  ) : (
    <NavBarPublic />
  );
};

export default NavBarSelection;
