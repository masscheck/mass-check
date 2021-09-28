import express from 'express';
import AccountInterface from 'src/db-interface/account.interface';

import { logger } from '../middlewares/logger';
import AccountModel from '../models/account.model';
import { getXpxAccBalance } from '../blockchain/account.xpx';

const router = express.Router();

router.get('/retrieve-user-info', async (req, res, next) => {
  const { uid } = req.query;

  try {
    const accInfo = await new Promise<AccountInterface>((resolve, reject) => {
      AccountModel.findById(uid)
        .populate('investigatedTweets._id')
        .populate('verifiedTweets._id')
        .populate('forfeitedTweets._id')
        .exec((err, result) => {
          if (err) reject(err);

          resolve(result);
        });
    });
    logger.info('MongoDB - Retrieve Account Info', accInfo);

    if (!accInfo) {
      throw 'No account found in DB';
    }

    res.json(accInfo);
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

router.get('/retrieve-xpx-balance', async (req, res, next) => {
  const { xpxAddress } = req.query;

  try {
    const xpxBalance = await getXpxAccBalance(xpxAddress as string);

    logger.info('ProximaX - Retrieve XPX Balance', xpxBalance);

    res.json(xpxBalance);
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

export default router;
