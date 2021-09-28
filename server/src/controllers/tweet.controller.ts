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
        forfeitedId: { $nin: [uid] },
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

const addToForfeitedList = async (uid: string, tweetId: string) => {
  await new Promise((resolve, reject) => {
    TweetModel.findByIdAndUpdate(
      tweetId,
      {
        $inc: { totalUserHadParticipants: -1 },
        $pull: { wipId: { _id: uid } },
        $push: { forfeitedId: uid },
      },
      (err, result) => {
        if (err) reject(err);

        resolve(result);
      }
    );
  });

  const tweetInfo = await getTweetInfoById(tweetId);
  logger.verbose('MongoDB - addToForfeitedList', tweetInfo);
};

const updateTweetAnalyseStage = async (tweetId: string, curStage: string) => {
  const tweetInfo = await getTweetInfoById(tweetId);

  const { investigatorsId, jurorsId, eachStageRequiredUserNum } = tweetInfo;
  const { INVESTIGATING, VERIFYING, COMPLETED } = AnalysePhaseConstant;

  if (
    curStage === INVESTIGATING &&
    investigatorsId.length === eachStageRequiredUserNum
  ) {
    await new Promise((resolve, reject) => {
      TweetModel.findByIdAndUpdate(
        tweetId,
        {
          curAnalysedPhase: VERIFYING,
        },
        (err, result) => {
          if (err) reject(err);

          resolve(result);
        }
      );
    });
  } else if (
    curStage === VERIFYING &&
    jurorsId.length === eachStageRequiredUserNum
  ) {
    await new Promise((resolve, reject) => {
      TweetModel.findByIdAndUpdate(
        tweetId,
        {
          curAnalysedPhase: COMPLETED,
        },
        (err, result) => {
          if (err) reject(err);

          resolve(result);
        }
      );
    });
  }
};

const submitTweetReportForInvestigation = async (
  uid: string,
  tweetId: string,
  reportId: string
) => {
  await new Promise((resolve, reject) => {
    TweetModel.findByIdAndUpdate(
      tweetId,
      {
        $push: { investigatorsId: uid, investigatedReportIdList: reportId },
        $pull: { wipId: { _id: uid } },
      },
      (err, result) => {
        if (err) reject(err);

        resolve(result);
      }
    );
  });

  await updateTweetAnalyseStage(tweetId, AnalysePhaseConstant.INVESTIGATING);

  const tweetInfo = await getTweetInfoById(tweetId);
  logger.verbose('MongoDB - submitTweetReportForInvestigation', tweetInfo);
};

export {
  getRandomTweetAndItsInfo,
  addUserToTweetWIP,
  updateTweetWIPStartTime,
  addToForfeitedList,
  submitTweetReportForInvestigation,
};
