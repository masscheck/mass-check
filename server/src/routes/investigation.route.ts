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
  addToForfeitedList,
  submitTweetReportForInvestigation,
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

router.post('/submit-report', async (req, res, next) => {
  const { uid, tweetId, reportId, xpxAddress } = req.body;

  try {
    await submitTweetReportForInvestigation(uid, tweetId, reportId);

    await onInvestigationSubmission(uid, tweetId);

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
