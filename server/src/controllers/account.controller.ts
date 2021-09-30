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
  logger.verbose('MongoDB - removeUserFromAccountWIP', accountInfo);
};

const addForfeitedTweetToAccount = async (uid: string, tweetId: string) => {
  const { MIN_CREDIBILITY, FORFEIT_TASK } = CredibilityScoreSystemConstant;

  const oldAccountInfo = await getAccountInfoById(uid);
  const { userCredibilityScore } = oldAccountInfo;

  // Ensure the credibility score capped at 100
  let credibilityScoreToDecrease = FORFEIT_TASK;
  if (userCredibilityScore + FORFEIT_TASK < MIN_CREDIBILITY) {
    credibilityScoreToDecrease = userCredibilityScore - MIN_CREDIBILITY;
  }

  await new Promise((resolve, reject) => {
    AccountModel.findByIdAndUpdate(
      uid,
      {
        $inc: {
          userCredibilityScore: credibilityScoreToDecrease,
        },
        $pull: { wipTweets: { tweetId } },
        $push: {
          forfeitedTweets: {
            _id: tweetId,
            xpxReward: 0,
            credibilityScoreReward: credibilityScoreToDecrease,
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

const onVerificationSubmission = async (uid: string, tweetId: string) => {
  await new Promise((resolve, reject) => {
    AccountModel.findByIdAndUpdate(
      uid,
      {
        $pull: { wipTweets: { tweetId } },
        $push: {
          verifiedTweets: {
            _id: tweetId,
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
  logger.verbose('MongoDB - onVerificationSubmission', accountInfo);
};

const modifyUserCredibilityScoreAndInsertRecord = async (
  uid: string,
  tweetId: string,
  credibilityScore: number,
  xpxCoin: number
) => {
  const { MAX_CREDIBILITY: MAX_SCORE } = CredibilityScoreSystemConstant;

  const oldAccountInfo = await getAccountInfoById(uid);
  const { userCredibilityScore } = oldAccountInfo;

  // Ensure the credibility score capped at 100
  let credibilityScoreToIncrease = credibilityScore;
  if (userCredibilityScore + credibilityScoreToIncrease > MAX_SCORE) {
    credibilityScoreToIncrease = MAX_SCORE - userCredibilityScore;
  }

  await new Promise((resolve, reject) => {
    AccountModel.findByIdAndUpdate(
      uid,
      {
        $inc: {
          userCredibilityScore: credibilityScoreToIncrease,
        },
      },
      (err, result) => {
        if (err) reject(err);

        resolve(result);
      }
    );
  });

  await new Promise((resolve, reject) => {
    AccountModel.updateOne(
      { _id: uid, 'verifiedTweets._id': tweetId },
      {
        $set: {
          'verifiedTweets.$.xpxReward': xpxCoin,
          'verifiedTweets.$.credibilityScoreReward': credibilityScore,
        },
      }
    ).exec((err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });

  const accountInfo = await getAccountInfoById(uid);
  logger.verbose(
    'MongoDB - modifyUserCredibilityScoreAndInsertRecord',
    accountInfo
  );
};

export {
  getAccountInfoById,
  addUserToAccountWIP,
  removeUserFromAccountWIP,
  addForfeitedTweetToAccount,
  onInvestigationSubmission,
  onVerificationSubmission,
  modifyUserCredibilityScoreAndInsertRecord,
};
