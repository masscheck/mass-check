const express = require('express');

const { generateXpxAcc } = require('../blockchain/create-xpx-acc');
const { updateXpxAccAddress } = require('../firebase-cloud-firestore/update-data');

const router = express.Router();

router.post('/download-private-key', async (req, res, next) => {
  console.log('download api');
  const { privateKey, address } = generateXpxAcc();

  res.status(200).send({ privateKey, address: address.plain() });
});

router.post('/store-xpx-address', async (req, res, next) => {
  console.log('store xpx');
  console.log(req.body);

  const { uid, address } = req.body;

  try {
    await updateXpxAccAddress(uid, address);
  } catch (error) {
    console.log(error);
  }

  res.status(200).send({ msg: 'success' });
});

module.exports = router;
