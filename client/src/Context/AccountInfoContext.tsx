import React, { useContext, useState, useEffect } from 'react';

import { AccountModel } from '../Model/AccountModel';

type AccountInfoContextType = {
  accountInfo: AccountModel;
  setAccountInfo: (acc: AccountModel) => void;
};

const AccountInfoContext = React.createContext<Partial<AccountInfoContextType>>(
  {}
);

const useAccountInfo = () => {
  return useContext(AccountInfoContext);
};

const AccountInfoProvider: React.FC = ({ children }) => {
  const [accountInfo, setAccountInfo] = useState(new AccountModel());

  const value = {
    accountInfo,
    setAccountInfo,
  };

  useEffect(() => {
    console.log('On change: ', { accountInfo });
  }, [accountInfo]);

  return (
    <AccountInfoContext.Provider value={value}>
      {children}
    </AccountInfoContext.Provider>
  );
};

export { useAccountInfo, AccountInfoProvider };
