import express from 'express';

import { logger } from '../middlewares/logger';
import AccountModel from '../models/account.model';
import { auth } from '../firebase/firebase-config';

const router = express.Router();

router.get('/retrieve-acc-info', async (req, res, next) => {
  const { uid } = req.query;

  try {
    const accInfo = await AccountModel.findById(uid).exec();
    if (!accInfo) {
      throw 'No account found in DB';
    }
    logger.verbose('MongoDB - Retrieve Account Info', accInfo);

    const { displayName } = accInfo;

    res.json({
      displayName,
      xpxAddress: accInfo.xpxAddress,
    });
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

router.post('/email-pwd', async (req, res, next) => {
  const { email, password } = req.body;

  // try {
  //   const result = await auth.signInWithEmailAndPassword(email, password);

  //   const { additionalUserInfo, user } = result;

  //   res.json({
  //     user,
  //   });
  // } catch (err) {
  //   logger.error(err);

  //   res.sendStatus(500);
  // }

  res.sendStatus(200)
});

export default router;
