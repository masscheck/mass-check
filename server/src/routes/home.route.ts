import express from 'express';

import { logger } from '../middlewares/logger';
import { getTweetList } from '../controllers/tweet.controller';

const router = express.Router();

router.get('/retrieve-unverified-tweet-list', async (req, res, next) => {
  let queryStartDate = new Date(2100, 0, 1).getTime();

  const { nextUnverifiedTweetStartDate } = req.query;

  if (nextUnverifiedTweetStartDate) {
    queryStartDate = new Date(nextUnverifiedTweetStartDate as string).getTime();
  }

  try {
    const { tweetList, newNextTweetStartDate } = await getTweetList(
      false,
      queryStartDate
    );

    const unverifiedTweetRes = {
      unverifiedTweetList: tweetList,
      nextUnverifiedTweetStartDate: newNextTweetStartDate,
    };

    res.json(unverifiedTweetRes);
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

router.get('/retrieve-verified-tweet-list', async (req, res, next) => {
  let queryStartDate = new Date(2100, 0, 1).getTime();

  const { nextVerifiedTweetStartDate } = req.query;

  if (nextVerifiedTweetStartDate) {
    queryStartDate = new Date(nextVerifiedTweetStartDate as string).getTime();
  }

  try {
    const { tweetList, newNextTweetStartDate } = await getTweetList(
      true,
      queryStartDate
    );

    const verifiedTweetRes = {
      verifiedTweetList: tweetList,
      nextVerifiedTweetStartDate: newNextTweetStartDate,
    };

    res.json(verifiedTweetRes);
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

export default router;
