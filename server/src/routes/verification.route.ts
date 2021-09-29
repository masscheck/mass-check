import express from 'express';

import TweetModel from '../models/tweet.model';

import { AnalysePhaseConstant } from '../constants/analyse-phase-constant';
import { logger } from '../middlewares/logger';
import { CredibilityScoreSystemConstant } from '../constants/credibility-score-constant';
import { XpxRewardConstant } from '../constants/xpx-reward.constant';
import TweetInterface from '../db-interface/tweet.interface';
import { transferXpxCoin } from '../blockchain/perform-transaction.xpx';

import {
  getRandomTweetAndItsInfo,
  addUserToTweetWIP,
  updateTweetWIPStartTime,
  addToForfeitedList,
} from '../controllers/tweet.controller';
import {
  addUserToAccountWIP,
  removeUserFromAccountWIP,
  addForfeitedTweetToAccount,
  onInvestigationSubmission,
} from '../controllers/account.controller';

const router = express.Router();

router.get('/get-job', async (req, res, next) => {
  const { uid } = req.query;

  try {
    const tweetInfo = await getRandomTweetAndItsInfo(
      uid as string,
      AnalysePhaseConstant.VERIFYING
    );

    if (!tweetInfo) {
      logger.info('No verification task currently available');
      res.json({});
    }

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
      AnalysePhaseConstant.VERIFYING
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
    await removeUserFromAccountWIP(uid, tweetId);

    res.sendStatus(200);
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

router.post('/system-time-out', async (req, res, next) => {
  const { uid, tweetId } = req.body;

  try {
    await addToForfeitedList(uid, tweetId);

    await addForfeitedTweetToAccount(uid, tweetId);

    res.sendStatus(200);
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

router.post('/submit-tweet-verification', async (req, res, next) => {
  const { uid, xpxAddress, tweetId, isTweetReal } = req.body;

  try {
    const updatedTweetStatus = await new Promise((resolve, reject) => {
      TweetModel.findByIdAndUpdate(
        tweetId,
        {
          $push: { jurorsId: uid },
          $pull: { wipId: uid },
        },
        (err, result) => {
          if (err) reject(err);

          resolve(result);
        }
      );
    });
    logger.verbose('MongoDB - Update Tweet Status', updatedTweetStatus);

    // do later
    // const updatedAccountState = await new Promise((resolve, reject) => {
    //   AccountModel.findByIdAndUpdate(
    //     uid,
    //     {
    //       $pull: { wipTweets: { tweetId: tweetId } },
    //       $push: {
    //         investigatedTweets: {
    //           _id: tweetId,
    //           xpxReward: XpxRewardConstant.JUROR,
    //           credibilityScoreReward:
    //             CredibilityScoreSystemConstant.COMPLETE_INVESTIGATION,
    //         },
    //       },
    //       $inc: {
    //         userCredibilityScore:
    //           CredibilityScoreSystemConstant.COMPLETE_INVESTIGATION,
    //       },
    //     },
    //     (err, result) => {
    //       if (err) reject(err);

    //       resolve(result);
    //     }
    //   );
    // });
    // successLogger(req, updatedAccountState);

    const latestTweetInfo = await new Promise<TweetInterface>(
      (resolve, reject) => {
        TweetModel.findById(tweetId, (err, result) => {
          if (err) reject(err);

          resolve(result);
        });
      }
    );
    logger.verbose('MongoDB - Retrieve tweet info');

    if (
      latestTweetInfo.jurorsId.length ===
      latestTweetInfo.eachStageRequiredUserNum
    ) {
      // start to calculate trust index

      // update the stage to verifying
      const updatedAnalysedPhase = await new Promise<TweetInterface>(
        (resolve, reject) => {
          TweetModel.findByIdAndUpdate(
            tweetId,
            {
              curAnalysedPhase: AnalysePhaseConstant.COMPLETED,
            },
            (err, result) => {
              if (err) reject(err);

              resolve(result);
            }
          );
        }
      );
      logger.verbose('MongoDB - Update Analyse Phase', updatedAnalysedPhase);
    }

    // const transferXpxCointStatus = await transferXpxCoin(
    //   xpxAddress,
    //   XpxRewardConstant.INVESTIGATOR
    // );
    // successLogger(req, transferXpxCointStatus);

    res.sendStatus(200);
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

export default router;
