import express from 'express';
import jwt from 'jsonwebtoken';

// Enable dotenv
import dotenv from 'dotenv';
dotenv.config();

import { logger } from '../middlewares/logger';
import {
  createTokenById,
  getTokenById,
  deleteTokenById,
} from '../controllers/token.controller';

const router = express.Router();

const generateAccessToken = (uid) => {
  return jwt.sign(uid, process.env.ACCESS_TOKEN, { expiresIn: '5h' });
};

router.post('/create-token', async (req, res, next) => {
  const { uid } = req.body;

  const accessToken = generateAccessToken(uid);
  const refreshToken = jwt.sign(uid, process.env.REFRESH_TOKEN);

  // ADD TO DB

  try {
    await createTokenById(refreshToken);
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }

  logger.verbose('MongoDB - Create Token', { accessToken, refreshToken });
  res.json({ accessToken, refreshToken });
});

router.post('/delete-token', async (req, res, next) => {
  const { refreshToken } = req.body;

  try {
    await deleteTokenById(refreshToken);
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }

  logger.verbose('MongoDB - Delete Token', { refreshToken });
  res.status(200);
});

router.post('/refresh-token', (req, res) => {
  if (req.body.refreshToken == null) return res.status(401); // not authorised

  const { refreshToken } = req.body;
  const token = getTokenById(refreshToken);
  if (token == null) return res.status(403); // request forbidden

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, uid) => {
    if (err) return res.status(403);

    const accessToken = generateAccessToken(uid);

    logger.verbose('MongoDB - Refresh Token', 'Success');
    res.json({ accessToken });
  });
});

router.get('/', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);

    res.status(200);
  });
});

export default router;
