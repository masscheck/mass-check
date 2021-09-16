const express = require('express');

const {
  getUnverifiedTweetIdList,
  getVerifiedTweetIdList,
} = require('../firebase-cloud-firestore/get-data');

const router = express.Router();

router.get('/home/get-verified-tweets', async (req, res, next) => {
  const result = await getVerifiedTweetIdList();

  res.status(200).json({ result });
});

router.get('/home/get-unverified-tweets', async (req, res, next) => {
  const result = await getUnverifiedTweetIdList();

  res.status(200).json({ result });
});

module.exports = router;
