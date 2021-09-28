import express from 'express';

import TweetModel from '../models/tweet.model';
import AccountModel from '../models/account.model';

import { getRandomTweetInfo } from '../common-crud/retrieve-db.common';
import { addUserToWIP, removeUserToWIP } from '../common-crud/update-db.common';

import { logger } from '../middlewares/logger';
import { AnalysePhaseConstant } from '../constants/analyse-phase-constant';
import { CredibilityScoreSystemConstant } from '../constants/credibility-score-constant';
import { XpxRewardConstant } from '../constants/xpx-reward.constant';

import TweetInterface from '../db-interface/tweet.interface';

import { transferXpxCoin } from '../blockchain/perform-transaction.xpx';

import {
  getRandomTweetAndItsInfo,
  addUserToTweetWIP,
  updateTweetWIPStartTime,
} from '../controllers/tweet.controller';
import {
  addUserToAccountWIP,
} from '../controllers/account.controller';

const router = express.Router();

router.get('/get-job', async (req, res, next) => {
  const { uid } = req.query;

  try {
    const tweetInfo = await getRandomTweetAndItsInfo(
      uid as string,
      AnalysePhaseConstant.INVESTIGATING
    );
    const { _id } = tweetInfo;

    await addUserToTweetWIP(uid as string, _id);

    res.json({ tweetInfo });
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

router.post('/user-accept-job', async (req, res, next) => {
  const { uid, tweetId } = req.body;

  try {
    await updateTweetWIPStartTime(uid as string, tweetId as string);

    await addUserToAccountWIP(
      uid as string,
      tweetId,
      AnalysePhaseConstant.INVESTIGATING
    );

    res.sendStatus(200);
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

router.post('/user-cancel-job', async (req, res, next) => {
  const { uid, tweetId } = req.body;

  try {
    const removeUserToWIPStatus = await removeUserToWIP(uid, tweetId);

    res.sendStatus(200);
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

router.post('/system-time-out', async (req, res, next) => {
  const { uid, tweetId } = req.body;

  try {
    const removeUserToWIPStatus = await removeUserToWIP(uid, tweetId);

    const updatedAccountState = await new Promise((resolve, reject) => {
      AccountModel.findByIdAndUpdate(
        uid,
        {
          $pull: { wipTweets: { tweetId: tweetId } },
          $inc: {
            userCredibilityScore: CredibilityScoreSystemConstant.FORFEIT_TASK,
          },
        },
        (err, result) => {
          if (err) reject(err);

          resolve(result);
        }
      );
    });
    logger.verbose(
      'MongoDB Update - Update Account State',
      updatedAccountState
    );

    res.sendStatus(200);
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

router.post('/submit-report', async (req, res, next) => {
  const { uid, tweetId, reportId, xpxAddress } = req.body;

  try {
    const updatedTweetStatus = await new Promise((resolve, reject) => {
      TweetModel.findByIdAndUpdate(
        tweetId,
        {
          $push: { investigatorsId: uid, investigatedReportIdList: reportId },
          $pull: { wipId: uid },
        },
        (err, result) => {
          if (err) reject(err);

          resolve(result);
        }
      );
    });
    logger.verbose('MongoDB Update - Update Tweet Status', updatedTweetStatus);

    const updatedAccountState = await new Promise((resolve, reject) => {
      AccountModel.findByIdAndUpdate(
        uid,
        {
          $pull: { wipTweets: { tweetId: tweetId } },
          $push: {
            investigatedTweets: {
              _id: tweetId,
              xpxReward: XpxRewardConstant.INVESTIGATOR,
              credibilityScoreReward:
                CredibilityScoreSystemConstant.COMPLETE_INVESTIGATION,
            },
          },
          $inc: {
            userCredibilityScore:
              CredibilityScoreSystemConstant.COMPLETE_INVESTIGATION,
          },
        },
        (err, result) => {
          if (err) reject(err);

          resolve(result);
        }
      );
    });
    logger.verbose(
      'MongoDB Update - Update Account Status',
      updatedAccountState
    );

    const latestTweetInfo = await new Promise<TweetInterface>(
      (resolve, reject) => {
        TweetModel.findById(tweetId, (err, result) => {
          if (err) reject(err);

          resolve(result);
        });
      }
    );
    logger.verbose('MongoDB Retrieve - Latest Tweet Info', latestTweetInfo);

    if (
      latestTweetInfo.investigatorsId.length ===
      latestTweetInfo.eachStageRequiredUserNum
    ) {
      const updatedAnalysedPhase = await new Promise<TweetInterface>(
        (resolve, reject) => {
          TweetModel.findByIdAndUpdate(
            tweetId,
            {
              curAnalysedPhase: AnalysePhaseConstant.VERIFYING,
            },
            (err, result) => {
              if (err) reject(err);

              resolve(result);
            }
          );
        }
      );
      logger.verbose(
        'MongoDB Update - Update Analysed Phase',
        updatedAnalysedPhase
      );
    }

    const transferXpxCointStatus = await transferXpxCoin(
      xpxAddress,
      XpxRewardConstant.INVESTIGATOR
    );
    logger.info('ProximaX - Transfer XPX Coin', transferXpxCointStatus);

    res.sendStatus(200);
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

export default router;
