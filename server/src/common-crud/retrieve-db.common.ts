import TweetInterface from '../db-interface/tweet.interface';

import { AnalysePhaseConstant } from '../constants/analyse-phase-constant';
import TweetModel from '../models/tweet.model';
import { logger } from '../middlewares/logger';

const getTweetList = async (isVerified: boolean, queryStartDate: number) => {
  const tweetPerPage = 10;

  try {
    const tweetList = await new Promise<TweetInterface[]>((resolve, reject) => {
      const query = isVerified
        ? TweetModel.find({
            curAnalysedPhase: { $in: [AnalysePhaseConstant.COMPLETED] },
          })
        : TweetModel.find({
            curAnalysedPhase: { $nin: [AnalysePhaseConstant.COMPLETED] },
          });

      query
        .where('submitTime')
        .lt(queryStartDate)
        .sort({ submitTime: 'desc' })
        // .limit(tweetPerPage)
        .exec((err, result) => {
          if (err) reject(err);

          resolve(result);
        });
    });
    logger.verbose('MongoDB Query - Retrieve Tweet List', tweetList);

    let newNextTweetStartDate = null;

    if (tweetList.length > 0) {
      newNextTweetStartDate = tweetList[tweetList.length - 1]['submitTime'];
    }

    return { tweetList, newNextTweetStartDate };
  } catch (err) {
    throw err;
  }
};

const getRandomTweetInfo = async (uid: string, phase: string) => {
  const totalPerBatch = 1;

  let curMaxParticipantsStage = 5;
  curMaxParticipantsStage += phase === AnalysePhaseConstant.VERIFYING ? 5 : 0;

  const tweetInfo = await new Promise<any>((resolve, reject) => {
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

  return tweetInfo;
};

export { getTweetList, getRandomTweetInfo };
