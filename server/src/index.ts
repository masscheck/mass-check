import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import { logger } from './middlewares/logger';

// Enable dotenv
import dotenv from 'dotenv';
dotenv.config();

// Initialise express app
const app = express();

// Connecting MongoDB
mongoose
  .connect(process.env.DB_CONNECTION)
  .then((res) => {
    logger.info('Success to connect DB!');
  })
  .catch((err) => {
    logger.error('Failed to connect DB! Err: ', err);
  });

// Import Route
import SignUpRoute from './routes/signup.route';
import SignInRoute from './routes/signin.route';
import HomeRoute from './routes/home.route';
import InvestigationRoute from './routes/investigation.route';
import VerificationRoute from './routes/verification.route';
import UserProfileRoute from './routes/user-profile.route';
import TweetRoute from './routes/tweet.route';
import AuthRoute from './routes/auth.route';

// Config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Middleware
app.use((req, res, next) => {
  logger.http('ENTER Req Url: ', req.method, req.originalUrl || req.url);

  const oldWrite = res.write;
  const oldEnd = res.end;

  const chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);

    return oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) chunks.push(chunk);

    const body = Buffer.concat(chunks).toString('utf8');
    logger.http(`[${res.statusCode}] Response: `, body);
    logger.http('EXIT Req Url: ', req.method, req.originalUrl || req.url);

    oldEnd.apply(res, arguments);
  };

  next();
});

// Routing
app.use('/api/signup', SignUpRoute);
app.use('/api/signin', SignInRoute);
app.use('/api/home', HomeRoute);
app.use('/api/investigation', InvestigationRoute);
app.use('/api/verification', VerificationRoute);
app.use('/api/user-profile', UserProfileRoute);
app.use('/api/tweet', TweetRoute);
app.use('/api/auth', AuthRoute);
app.use('/', (req, res) => {
  res.send('MassCheck API');
});

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  logger.info('Server started! Listening on', PORT);
});
