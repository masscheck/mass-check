import express from 'express';

import AccountModel from '../models/account.model';
import { createXpxAcc } from '../blockchain/account.xpx';
import { logger } from '../middlewares/logger';
import { transferXpxCoin } from '../blockchain/perform-transaction.xpx';
import { XpxRewardConstant } from '../constants/xpx-reward.constant';

const router = express.Router();

router.post('/create-user-acc', async (req, res, next) => {
  const { uid, username, email } = req.body;

  try {
    const createdAccountInfo = await new Promise((resolve, reject) => {
      new AccountModel({
        _id: uid,
        displayName: username,
        email: email,
      }).save((err, result) => {
        if (err) reject(err);

        console.log({ result });
        resolve(result);
      });
    });

    logger.verbose('MongoDB - Create Account', createdAccountInfo);

    res.sendStatus(204);
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

router.post('/create-xpx-acc', async (req, res, next) => {
  try {
    const xpxAccountInfo = await createXpxAcc();
    logger.info('ProximaX - Create Account', {
      ...xpxAccountInfo,
      privateKey: 'CONFIDENTIAL',
    });

    res.json({ ...xpxAccountInfo });
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

router.post('/update-user-xpx-address', async (req, res, next) => {
  const { uid, xpxAddress } = req.body;

  try {
    const updateAccountInfo = await new Promise((resolve, reject) => {
      AccountModel.findByIdAndUpdate(
        uid,
        {
          xpxAddress,
        },
        (err, result) => {
          if (err) reject(err);

          resolve(result);
        }
      );
    });
    logger.verbose('MongoDB - Update Account', updateAccountInfo);

    // Sending Xpx Reward to user
    const transferXpxStatus = await transferXpxCoin(
      xpxAddress as string,
      XpxRewardConstant.STARTER,
      'Welcome to MassCheck'
    );
    logger.info('ProximaX - Transfer XPX Coin', transferXpxStatus);

    res.sendStatus(200);
  } catch (err) {
    logger.error(err);

    res.sendStatus(500);
  }
});

export default router;
