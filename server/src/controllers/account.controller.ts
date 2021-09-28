import AccountInterface from '../db-interface/account.interface';
import AccountModel from '../models/account.model';

import { logger } from '../middlewares/logger';

const getAccountInfoById = async (uid: string) => {
  const accountInfo = new Promise<AccountInterface>((resolve, reject) => {
    AccountModel.findById(uid).exec((err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });

  return accountInfo;
};

const addUserToAccountWIP = async (
  uid: string,
  tweetId: string,
  workType: string
) => {
  const addUserToAccountWIPStatus = await new Promise((resolve, reject) => {
    AccountModel.findByIdAndUpdate(
      uid,
      { $push: { wipTweets: { tweetId, workType } } },
      (err, result) => {
        if (err) reject(err);

        resolve(result);
      }
    );
  });

  const accountInfo = await getAccountInfoById(uid)
  logger.verbose('MongoDB - addUserToAccountWIP', accountInfo);

  return addUserToAccountWIPStatus;
};

export { addUserToAccountWIP };
