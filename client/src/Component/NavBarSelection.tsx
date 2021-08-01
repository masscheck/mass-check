import { useLocation } from 'react-router-dom';

import { useAuth } from '../Context/AuthContext';
import { LocalStorageEnum } from '../Util/Constant/LocalStorageEnum';
import NavBarSecure from './NavBarSecure';
import NavBarPublic from './NavBarPublic';

import './NavBarPublic.scss';

const NavBarSelection: React.FC = () => {
  const location = useLocation();

  return location.pathname.includes('public') ? (
    <NavBarPublic />
  ) : (
    <NavBarSecure />
  );
};

export default NavBarSelection;
