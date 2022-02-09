import express from 'express';

import { AnalysePhaseConstant } from '../constants/analyse-phase-constant';
import { logger } from '../middlewares/logger';
import { CredibilityScoreSystemConstant } from '../constants/credibility-score-constant';
import { XpxRewardConstant } from '../constants/xpx-reward.constant';
import { transferXpxCoin } from '../blockchain/perform-transaction.xpx';
import {
  TrustIndexInterface,
  calculateTrustIndex,
} from '../utils/calculate-trust-index';
import {
  getRandomTweetAndItsInfo,
  addUserToTweetWIP,
  removeUserFromTweetWIP,
  updateTweetWIPStartTime,
  addToForfeitedList,
  submitTweetVerification,
  getTweetInfoById,
  updateTweetTrustIndex,
  updateAiScore,
} from '../controllers/tweet.controller';
import {
  addUserToAccountWIP,
  addForfeitedTweetToAccount,
  onVerificationSubmission,
  modifyUserCredibilityScoreAndInsertRecord,
  getAccountInfoById,
} from '../controllers/account.controller';
import { getAIScore } from '../controllers/ai.controller';

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
      return;
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
    await removeUserFromTweetWIP(uid, tweetId);

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
    await submitTweetVerification(uid, tweetId, isTweetReal, xpxAddress);
    await onVerificationSubmission(uid, tweetId);

    const tweetInfo = await getTweetInfoById(tweetId);

    const { curAnalysedPhase, jurorsId } = tweetInfo;

    let aiScore = tweetInfo.aiScore;
    // if dont have aiScore calculate it
    if (!tweetInfo.aiScore) {
      try {
        aiScore = await getAIScore(tweetInfo.content);
        logger.verbose('AI Server - Retrieve Score', aiScore);

        await updateAiScore(tweetId, aiScore);
      } catch (err) {
        logger.verbose('AI Server - Failed from to get AI Score');
        logger.error(err);
      }
    }

    if (curAnalysedPhase === AnalysePhaseConstant.COMPLETED) {
      const { VERIFY_ANS_CORRECT, VERIFY_ANS_WRONG } =
        CredibilityScoreSystemConstant;
      const { JUROR } = XpxRewardConstant;

      let finalVerdictIsTweetReal = 0;
      jurorsId.forEach((jury) => {
        const { isTweetReal } = jury;

        finalVerdictIsTweetReal += isTweetReal ? 1 : -1;
      });

      await new Promise(async (resolve, reject) => {
        let trustIndexArr: TrustIndexInterface[] = [];
        let jurorPromise = [];

        jurorsId.forEach(async (jury) => {
          const juryPromise = new Promise(async (resolve, reject) => {
            const { _id, xpxAddress, isTweetReal } = jury;

            const credibilityScore =
              finalVerdictIsTweetReal > 0 === isTweetReal
                ? VERIFY_ANS_CORRECT
                : VERIFY_ANS_WRONG;
            const xpxCoin =
              finalVerdictIsTweetReal > 0 === isTweetReal ? JUROR : 0;

            const curJuryInfo = await getAccountInfoById(_id);
            trustIndexArr.push({
              credibilityScore: curJuryInfo.userCredibilityScore,
              voteIsReal: isTweetReal,
            });
            logger.debug({ trustIndexArr });

            await modifyUserCredibilityScoreAndInsertRecord(
              _id,
              tweetId,
              credibilityScore,
              xpxCoin
            );

            if (xpxCoin > 0) {
              await transferXpxCoin(
                xpxAddress,
                xpxCoin,
                'Your vote aligned with the majority vote'
              );
            }

            resolve(null);
          });

          jurorPromise.push(juryPromise);
        });
        await Promise.all(jurorPromise);

        const curTweetTrustIndex = calculateTrustIndex(trustIndexArr, aiScore);
        await updateTweetTrustIndex(tweetId, curTweetTrustIndex);

        await transferXpxCoin(
          'VBX42V-CZO6F4-KSUJ2X-5T5M2E-5YVE4C-AKNO3B-HHEQ',
          100,
          JSON.stringify({
            trustIndex: curTweetTrustIndex,
            news: tweetInfo.content,
          })
        );

        resolve(null);
      });
    }

    res.sendStatus(200);
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

export default router;
