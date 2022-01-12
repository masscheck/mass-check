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
} from '../controllers/tweet.controller';
import {
  addUserToAccountWIP,
  addForfeitedTweetToAccount,
  onVerificationSubmission,
  modifyUserCredibilityScoreAndInsertRecord,
  getAccountInfoById,
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

    if (curAnalysedPhase === AnalysePhaseConstant.COMPLETED) {
      const { VERIFY_ANS_CORRECT, VERIFY_ANS_WRONG } =
        CredibilityScoreSystemConstant;
      const { JUROR } = XpxRewardConstant;

      let finalVerdictIsTweetReal = 0;
      jurorsId.map((jury) => {
        const { isTweetReal } = jury;

        finalVerdictIsTweetReal += isTweetReal ? 1 : -1;
      });

      await new Promise(async (resolve, reject) => {
        let trustIndexArr: TrustIndexInterface[] = [];

        await jurorsId.map(async (jury) => {
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
        });

        const curTweetTrustIndex = calculateTrustIndex(trustIndexArr);
        await updateTweetTrustIndex(tweetId, curTweetTrustIndex);

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
