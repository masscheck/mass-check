import express from 'express';

import { logger } from '../middlewares/logger';
import AccountModel from '../models/account.model';

const router = express.Router();

router.post('/create-tweet', async (req, res, next) => {
  console.log(req);

  // const { uid } = req.query;

  // try {
  //   const accInfo = await AccountModel.findById(uid).exec();
  //   if (!accInfo) {
  //     throw 'No account found in DB';
  //   }
  //   logger.verbose('MongoDB - Retrieve Account Info', accInfo);

  //   const { displayName } = accInfo;

  //   res.json({
  //     displayName,
  //     xpxAddress: accInfo.xpxAddress,
  //   });
  // } catch (err) {
  //   logger.error(err);

  //   res.sendStatus(500);
  // }

  res.sendStatus(200);
});

export default router;
