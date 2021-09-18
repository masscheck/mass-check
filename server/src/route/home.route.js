const express = require('express');

const {
  getUnverifiedTweetIdList,
  getVerifiedTweetIdList,
} = require('../firebase-cloud-firestore/get-data');

const router = express.Router();

router.get('/home/get-verified-tweets', async (req, res, next) => {
  const result = await getVerifiedTweetIdList();
  const tweetResultList = [];

  result.forEach((tweet) => {
    const {
      stage,
      submit_time: submitTime,
      ai_score: aiScore,
      author_tag: authorTag,
      author_name: authorName,
      submit_by: submitBy,
      content,
    } = tweet;

    tweetResultList.push({
      stage,
      submitBy,
      submitTime,
      aiScore,
      authorName,
      authorTag,
      content,
    });
  });

  res.status(200).json({ result: tweetResultList });
});

router.get('/home/get-unverified-tweets', async (req, res, next) => {
  const result = await getUnverifiedTweetIdList();
  const tweetResultList = [];

  result.forEach((tweet) => {
    const {
      stage,
      submit_time: submitTime,
      ai_score: aiScore,
      author_tag: authorTag,
      author_name: authorName,
      submit_by: submitBy,
      content,
    } = tweet;

    tweetResultList.push({
      stage,
      submitBy,
      submitTime,
      aiScore,
      authorName,
      authorTag,
      content,
    });
  });

  console.log({ tweetResultList });

  res.status(200).json({ result: tweetResultList });
});

module.exports = router;
