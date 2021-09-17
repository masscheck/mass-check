const express = require('express');
const { StageConstant } = require('../constant/stage-constant');

const {
  getBatchList,
  getTweetIdList,
  getTweetInfo,
} = require('../firebase-cloud-firestore/get-data');
const {
  updateTweetStageToInvestigating,
  updateTweetUponSubmitDocument,
  updateTweetThatUserAgreeToInvestigating,
  updateUserProfileUponSubmitDocument,
} = require('../firebase-cloud-firestore/update-data');
const { randomGenIndex } = require('../util/helper-function');

const router = express.Router();

router.get('/queue-investigation', async (req, res, next) => {
  try {
    const batchList = await getBatchList();
    const randomBatchIndex = randomGenIndex(batchList.length);
    const batchId = batchList[randomBatchIndex];

    const tweetIdList = await getTweetIdList(batchId);
    const randomTweetIndex = randomGenIndex(tweetIdList.length);
    const tweetId = tweetIdList[randomTweetIndex];

    res.status(200).json({ tweetId });
  } catch (err) {
    console.log(err);
    res.status(500);
    throw err;
  }
});

router.post(
  '/retrieve-tweet-info-for-investigating',
  async (req, res, next) => {
    let { tweetId, uid } = req.body;

    try {
      const result = await getTweetInfo(tweetId);
      console.log({ tweetInfo: result });

      const {
        stage,
        submit_time: submitTime,
        ai_score: aiScore,
        author_tag: authorTag,
        author_name: authorName,
        submit_by: submitBy,
        content,
      } = result;

      if (stage !== StageConstant.INVESTIGATING) {
        await updateTweetStageToInvestigating(tweetId);
      }

      await updateTweetThatUserAgreeToInvestigating(tweetId, uid);

      res.status(200).json({
        tweetId,
        stage: StageConstant.INVESTIGATING,
        submitBy,
        submitTime,
        aiScore,
        authorName,
        authorTag,
        content,
      });
    } catch (err) {
      console.log(err);
      res.status(500);
      throw err;
    }
  }
);

router.post('/submit-report', async (req, res, next) => {
  const { uid, reportId, tweetId } = req.body;
  const xpxCoin = 5000;
  const crediblityScore = 5;

  console.log({ uid, reportId, tweetId });

  try {
    await updateTweetUponSubmitDocument(uid, tweetId, reportId);
    await updateUserProfileUponSubmitDocument(
      uid,
      tweetId,
      xpxCoin,
      crediblityScore
    );

    res.status(200).json({ status: 'success' });
  } catch (err) {
    console.log(err);
    res.status(500);
    throw err;
  }
});

module.exports = router;
