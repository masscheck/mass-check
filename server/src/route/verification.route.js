const express = require('express');
const { StageConstant } = require('../constant/stage-constant');

const {
  getTweetToBeVerify,
  getTweetInfo,
} = require('../firebase-cloud-firestore/get-data');
const {
  updateTweetThatUserAgreeToVerifying,
  updateTweetStageToVerify,
} = require('../firebase-cloud-firestore/update-data');
const { randomGenIndex } = require('../util/helper-function');

const router = express.Router();

router.get('/queue-verification', async (req, res, next) => {
  try {
    const result = await getTweetToBeVerify();
    const randomTweetId = randomGenIndex(result.length);
    const tweetId = result[randomTweetId];

    res.status(200).json({ tweetId });
  } catch (err) {
    console.log(err);
    res.status(500);
    throw err;
  }
});

router.post('/retrieve-tweet-info-for-verification', async (req, res, next) => {
  let { tweetId, uid } = req.body;

  console.log({ tweetId, reqBody: req.body });

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
      investigated_report_id_list: investigatedReportIdList,
    } = result;

    if (stage !== StageConstant.VERIFYING) {
      await updateTweetStageToVerify(tweetId);
    }

    await updateTweetThatUserAgreeToVerifying(tweetId, uid);

    res.status(200).json({
      tweetId,
      stage: StageConstant.INVESTIGATING,
      submitBy,
      submitTime,
      aiScore,
      authorName,
      authorTag,
      content,
      investigatedReportIdList,
    });
  } catch (err) {
    console.log(err);
    res.status(500);
    throw err;
  }
});

router.post('/submit-verification-tweet', async (req, res, next) => {
  let { tweetId, uid, isTweetReal } = req.body;

  console.log({ tweetId, reqBody: req.body });

  try {
  } catch (err) {
    console.log(err);
    res.status(500);
    throw err;
  }
});

module.exports = router;
