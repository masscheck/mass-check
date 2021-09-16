const { AccountHttp, Address, NetworkType } = require('tsjs-xpx-chain-sdk');

const getXpxAccountBalance = async (accAddress) => {
  console.log({ accAddress });

  const accountHttp = new AccountHttp(
    'http://bctestnet1.brimstone.xpxsirius.io:3000'
  );
  const address = Address.createFromRawAddress(
    'VD5DT3-CH4BLA-BL5HIM-EKP2TA-PUKF4N-Y3L5HR-IR54'
  );

  await accountHttp.getAccountInfo(address).subscribe(
    (accountInfo) => console.log(accountInfo),
    (err) => console.error(err)
  );
};

module.exports = { getXpxAccountBalance };
