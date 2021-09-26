import express from 'express';

import TweetModel from '../models/tweet.model';
import AccountModel from '../models/account.model';
import { getRandomTweetInfo } from '../common-crud/retrieve-db.common';
import { addUserToWIP, removeUserToWIP } from '../common-crud/update-db.common';
import { AnalysePhaseConstant } from '../constants/analyse-phase-constant';
import { logger } from '../middlewares/logger';
import { CredibilityScoreSystemConstant } from '../constants/credibility-score-constant';
import { XpxRewardConstant } from '../constants/xpx-reward.constant';
import TweetInterface from '../db-interface/tweet.interface';
import { transferXpxCoin } from '../blockchain/perform-transaction.xpx';

const router = express.Router();

router.get('/get-job', async (req, res, next) => {
  const { uid } = req.query;

  try {
    const tweetInfo = await getRandomTweetInfo(
      uid as string,
      AnalysePhaseConstant.VERIFYING
    );

    if (!tweetInfo) {
      res.json({});
      return;
    }

    const addUserToWIPStatus = await addUserToWIP(
      uid as string,
      tweetInfo._id,
      AnalysePhaseConstant.VERIFYING
    );

    res.json({ tweetInfo });
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
    logger.verbose('MongoDB - Update Account State', updatedAccountState);

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
    logger.verbose('MongoDB - Update Tweet Status', updatedTweetStatus)

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
      logger.verbose('MongoDB - Update Analyse Phase', updatedAnalysedPhase)
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
