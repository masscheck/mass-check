import { useLocation } from 'react-router-dom';

import { useAuth } from '../Context/AuthContext';
import { LocalStorageEnum } from '../Util/Constant/LocalStorageEnum';
import NavBarHome from './NavBarSecure';
import NavBar from './NavBarPublic';

import './NavBarPublic.scss';

const NavBarSelection: React.FC = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  return !currentUser ||
    location.pathname === '/sign-up-success' ||
    (location.pathname === '/faq' &&
      localStorage.getItem(LocalStorageEnum.STAGE) !== 'home') ? (
    <NavBar />
  ) : (
    <NavBarHome />
  );
};

export default NavBarSelection;
