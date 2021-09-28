import AccountInterface from '../db-interface/account.interface';
import AccountModel from '../models/account.model';

import { CredibilityScoreSystemConstant } from '../constants/credibility-score-constant';
import { XpxRewardConstant } from '../constants/xpx-reward.constant';

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
  await new Promise((resolve, reject) => {
    AccountModel.findByIdAndUpdate(
      uid,
      { $push: { wipTweets: { tweetId, workType } } },
      (err, result) => {
        if (err) reject(err);

        resolve(result);
      }
    );
  });

  const accountInfo = await getAccountInfoById(uid);
  logger.verbose('MongoDB - addUserToAccountWIP', accountInfo);
};

const removeUserFromAccountWIP = async (uid: string, tweetId: string) => {
  await new Promise((resolve, reject) => {
    AccountModel.findByIdAndUpdate(
      uid,
      { $pull: { wipTweets: { tweetId } } },
      (err, result) => {
        if (err) reject(err);

        resolve(result);
      }
    );
  });

  const accountInfo = await getAccountInfoById(uid);
  logger.verbose('MongoDB - addUserToAccountWIP', accountInfo);
};

const addForfeitedTweetToAccount = async (uid: string, tweetId: string) => {
  await new Promise((resolve, reject) => {
    AccountModel.findByIdAndUpdate(
      uid,
      {
        $inc: {
          userCredibilityScore: CredibilityScoreSystemConstant.FORFEIT_TASK,
        },
        $pull: { wipTweets: { tweetId } },
        $push: {
          forfeitedTweets: {
            _id: tweetId,
            xpxReward: 0,
            credibilityScoreReward: CredibilityScoreSystemConstant.FORFEIT_TASK,
          },
        },
      },
      (err, result) => {
        if (err) reject(err);

        resolve(result);
      }
    );
  });

  const accountInfo = await getAccountInfoById(uid);
  logger.verbose('MongoDB - addForfeitedTweetToAccount', accountInfo);
};

const onInvestigationSubmission = async (uid: string, tweetId: string) => {
  const { COMPLETE_INVESTIGATION, MAX_CREDIBILITY: MAX_SCORE } =
    CredibilityScoreSystemConstant;

  const oldAccountInfo = await getAccountInfoById(uid);
  const { userCredibilityScore } = oldAccountInfo;

  // Ensure the credibility score capped at 100
  let credibilityScoreToIncrease = COMPLETE_INVESTIGATION;
  if (userCredibilityScore + COMPLETE_INVESTIGATION > MAX_SCORE) {
    credibilityScoreToIncrease = MAX_SCORE - userCredibilityScore;
  }

  await new Promise((resolve, reject) => {
    AccountModel.findByIdAndUpdate(
      uid,
      {
        $inc: {
          userCredibilityScore: credibilityScoreToIncrease,
        },
        $pull: { wipTweets: { tweetId } },
        $push: {
          investigatedTweets: {
            _id: tweetId,
            xpxReward: XpxRewardConstant.INVESTIGATOR,
            credibilityScoreReward: COMPLETE_INVESTIGATION,
          },
        },
      },
      (err, result) => {
        if (err) reject(err);

        resolve(result);
      }
    );
  });

  const accountInfo = await getAccountInfoById(uid);
  logger.verbose('MongoDB - onInvestigationSubmission', accountInfo);
};

export {
  addUserToAccountWIP,
  removeUserFromAccountWIP,
  addForfeitedTweetToAccount,
  onInvestigationSubmission,
};
