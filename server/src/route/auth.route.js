require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const generateAccessToken = (userInfo) => {
  return jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15s',
  });
};

router.post('/sign-in', async (req, res, next) => {
  let { uid, username } = req.body;
  userInfo = {
    uid,
    username,
  };
  console.log(new Date(), req.body);
  console.log(new Date(), userInfo);

  const accessToken = generateAccessToken(userInfo);
  // const refreshToken = jwt.sign(userInfo, process.env.REFRESH_TOKEN_SECRET);
  // refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken });
  // res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

module.exports = router;
