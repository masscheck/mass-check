const { Account, NetworkType } = require('tsjs-xpx-chain-sdk');

const generateXpxAcc = () => {
  const account = Account.generateNewAccount(NetworkType.TEST_NET);
  const { privateKey, address } = account;

  return { privateKey, address };
};

exports.generateXpxAcc = generateXpxAcc;
