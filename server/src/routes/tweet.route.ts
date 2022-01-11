import express from 'express';

import { logger } from '../middlewares/logger';
import TwitterModel from '../models/tweet.model';

const router = express.Router();

router.post('/create-tweet', async (req, res, next) => {
  console.log(req.body);
  const {hashedTweetContent, tweetContent, tweetAuthorName, tweetAuthorTag} = req.body;
  try {
    const createdTwitte = await new Promise((resolve, reject) => {
      new TwitterModel({
        _id: hashedTweetContent,
        content: tweetContent,
        authorName: tweetAuthorName,
        authorTag: tweetAuthorTag
      }).save((err, result) => {
        if (err) reject(err);

        console.log({ result });
        resolve(result);
      });
    });

    logger.verbose('MongoDB - Create Tweet', createdTwitte);

    res.sendStatus(200);
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }

  // const { uid } = req.query;

  // try {
  //   const accInfo = await AccountModel.findById(uid).exec();
  //   if (!accInfo) {
  //     throw 'No account found in DB';
  //   }
  //   logger.verbose('MongoDB - Retrieve Account Info', accInfo);

  //   const { displayName } = accInfo;

  //   res.json({
  //     displayName,
  //     xpxAddress: accInfo.xpxAddress,
  //   });
  // } catch (err) {
  //   logger.error(err);

  //   res.sendStatus(500);
  // }

  res.sendStatus(200);
});

export default router;
