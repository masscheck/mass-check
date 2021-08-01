const express = require('express');
const { createAcc } = require('../firebase-cloud-firestore/create-data');

const router = express.Router();

router.post('/create-acc', async (req, res, next) => {
  let { uid, username, email } = req.body;

  try {
    await createAcc(uid, username, email);
  } catch (err) {
    console.log(err);
    throw err;
  }

  res.status(200).json({ msg: 'success' });
});

module.exports = router;
