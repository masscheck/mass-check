require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const { storeJwt } = require('../firebase-cloud-firestore/create-data');
const { isTokenInDb } = require('../firebase-cloud-firestore/get-data');
const { deleteToken } = require('../firebase-cloud-firestore/delete-data');

const router = express.Router();

// 2 hrs, units in milliseconds
const tokenActiveDuration = (60 + 60) * 60 * 1000;

const generateAccessToken = (userInfo) => {
  return jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '2 hrs',
  });
};

router.post('/is-authenticated', async (req, res, next) => {
  console.log('/is-authenticated');

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    console.log('Decoded: ', decoded);

    if (err) return res.sendStatus(403);

    const { uid, username } = decoded;

    res.json({ uid, username });
  });
});

router.post('/refresh-token', async (req, res, next) => {
  const refreshToken = req.body.token;

  if (!refreshToken) return res.sendStatus(401);

  const isInDb = await isTokenInDb(refreshToken);
  if (!isInDb) return res.sendStatus(403); // change to firebase

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken({ payload: decoded.payload });
    console.log(decoded);

    res.json({
      accessToken: accessToken,
      expireTime: Date.now() + tokenActiveDuration,
    });
  });
});

router.post('/create-token', async (req, res, next) => {
  let { uid, username } = req.body.payload;
  userInfo = {
    uid,
    username,
  };
  console.log(new Date(), userInfo);

  const accessToken = generateAccessToken(userInfo);
  const refreshToken = jwt.sign(userInfo, process.env.REFRESH_TOKEN_SECRET);
  await storeJwt(refreshToken);

  res.json({
    accessToken: accessToken,
    refreshToken: refreshToken,
    expireTime: Date.now() + tokenActiveDuration,
  });
});

router.delete('/delete-token', async (req, res, next) => {
  const { token } = req.body;

  await deleteToken(token);

  res.status(200).json('AccessToken Deleted');
});

module.exports = router;
