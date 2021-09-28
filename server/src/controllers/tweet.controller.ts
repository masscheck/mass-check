import TweetInterface from '../db-interface/tweet.interface';
import TweetModel from '../models/tweet.model';

import { AnalysePhaseConstant } from '../constants/analyse-phase-constant';
import { logger } from '../middlewares/logger';

const getTweetInfoById = async (id: string) => {
  const tweetInfo = await new Promise<TweetInterface>((resolve, reject) => {
    setTimeout(() => {
      TweetModel.findById(id).exec((err, result) => {
        if (err) reject(err);

        resolve(result);
      });
    }, 500);
  });

  return tweetInfo;
};

const getRandomTweetAndItsInfo = async (uid: string, phase: string) => {
  const totalPerBatch = 1; // TODO Change back later

  let curMaxParticipantsStage = 5;
  curMaxParticipantsStage += phase === AnalysePhaseConstant.VERIFYING ? 5 : 0;

  const tweetInfo = await new Promise<TweetInterface>((resolve, reject) => {
    TweetModel.aggregate()
      .match({
        curAnalysedPhase: phase,
        investigatorsId: { $nin: [uid] },
        jurorsId: { $nin: [uid] },
        totalUserHadParticipants: { $lt: curMaxParticipantsStage },
      })
      .sort({ submitTime: 'asc' })
      .limit(totalPerBatch)
      .sample(1)
      .exec((err, result) => {
        if (err) reject(err);

        resolve(result[0]);
      });
  });
  logger.verbose('MongoDB - getRandomTweetAndItsInfo', tweetInfo);

  return tweetInfo;
};

const addUserToTweetWIP = async (uid: string, tweetId: string) => {
  await new Promise((resolve, reject) => {
    TweetModel.findByIdAndUpdate(
      tweetId,
      { $inc: { totalUserHadParticipants: 1 }, $push: { wipId: { _id: uid } } },
      (err, result) => {
        if (err) reject(err);

        resolve(result);
      }
    );
  });

  const tweetInfo = await getTweetInfoById(tweetId);
  logger.verbose('MongoDB - addUserToTweetWIP', tweetInfo);
};

const updateTweetWIPStartTime = async (uid: string, tweetId: string) => {
  await new Promise((resolve, reject) => {
    TweetModel.findOneAndUpdate(
      { _id: tweetId, wipId: { _id: uid } },
      { $set: { 'wipId.$.startedOn': new Date() } }
    ).exec((err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });

  const tweetInfo = await getTweetInfoById(tweetId);
  logger.verbose('MongoDB - updateTweetWIPStartTime', tweetInfo);
};

export { getRandomTweetAndItsInfo, addUserToTweetWIP, updateTweetWIPStartTime };
