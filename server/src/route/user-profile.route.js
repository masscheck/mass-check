const express = require('express');

const { getUserInfo } = require('../firebase-cloud-firestore/get-data');
const { getXpxAccountBalance } = require('../blockchain/get-xpx-acc-info');

const router = express.Router();

router.post('/user-profile/get-xpx-acc-balance', async (req, res, next) => {
  let { uid } = req.body;

  console.log({ uid, type: typeof uid });

  try {
    const userInfo = await getUserInfo(uid);
    const { address } = userInfo;
    const accBalance = await getXpxAccountBalance(address);

    console.log({ userInfo, accBalance });

    res.status(200).json({ xpxAccBalance: userInfo });
  } catch (err) {
    console.log(err);
  }
});

router.post('/user-profile/get-credibility-score', async (req, res, next) => {
  let { uid } = req.body;

  try {
    const result = await getUserInfo(uid);
    const { credibilityScore } = result;

    res.status(200).json({ credibilityScore });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
