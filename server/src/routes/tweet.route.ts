import express from 'express';

import { logger } from '../middlewares/logger';
import TwitterModel from '../models/tweet.model';
import { getTweetInfoByIds } from '../controllers/tweet.controller';
import { getAIScore } from '../controllers/ai.controller';

const router = express.Router();

router.post('/create-tweet', async (req, res, next) => {
  const {
    id,
    tweetContent,
    tweetAuthorName,
    tweetAuthorTag,
    submitBy,
    submitByUid,
  } = req.body;

  let aiScore = null;

  try {
    aiScore = await getAIScore(tweetContent);

    if (aiScore >= 0.95) {
      const penalty = Math.floor(Math.random() * 15) / 100;
      aiScore -= penalty;
    } else if (aiScore < 0.2) {
      if (aiScore < 0.05) {
        aiScore += 0.1;
      }

      const penalty = Math.floor(Math.random() * 20) / 100;
      aiScore += penalty;
    }

    logger.verbose('AI Server - Retrieve Score', aiScore);
  } catch (err) {
    logger.verbose('AI Server - Failed from to get AI Score');
    logger.error(err);
  }

  try {
    const createdTweet = await new Promise((resolve, reject) => {
      new TwitterModel({
        _id: id,
        content: tweetContent,
        authorName: tweetAuthorName,
        authorTag: tweetAuthorTag,
        submitBy,
        submitByUid,
        aiScore,
      }).save((err, result) => {
        if (err) reject(err);

        console.log({ result });
        resolve(result);
      });
    });
    logger.verbose('MongoDB - Create Tweet', createdTweet);

    res.sendStatus(200);
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

router.post('/retrieve-tweet-info', async (req, res, next) => {
  const { hashedTweetIdList } = req.body;

  try {
    const tweetInfo = await getTweetInfoByIds(hashedTweetIdList);

    res.json({ tweetInfo });
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

export default router;
