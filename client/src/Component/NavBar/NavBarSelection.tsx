import { useLocation } from 'react-router-dom';

import { useAccountInfo } from '../../Context/AccountInfoContext';

import NavBarSecure from './NavBarSecure';
import NavBarPublic from './NavBarPublic';

import './NavBarPublic.scss';

const NavBarSelection: React.FC = () => {
  const {
    accountInfo: { toSecureAllowable },
  } = useAccountInfo();

  return toSecureAllowable ? <NavBarSecure /> : <NavBarPublic />;
};

export default NavBarSelection;
