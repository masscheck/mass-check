import {
  Account,
  Address,
  NetworkType,
  Deadline,
  NetworkCurrencyMosaic,
  PlainMessage,
  TransferTransaction,
  TransactionHttp,
  Listener,
} from 'tsjs-xpx-chain-sdk';
import { filter, mergeMap, map, first } from 'rxjs';

import { privateKey, testNetGenerationHash, testNetUrl } from './xpx-info.xpx';

import { logger } from '../middlewares/logger';

const transferXpxCoin = (
  recipientRawAddress: string,
  xpxAmount: number,
  message: string
) => {
  return new Promise<any>((resolve, reject) => {
    const recipientAddress = Address.createFromRawAddress(recipientRawAddress);

    const transferTransaction = TransferTransaction.create(
      Deadline.create(),
      recipientAddress,
      [NetworkCurrencyMosaic.createRelative(xpxAmount)],
      PlainMessage.create(message),
      NetworkType.TEST_NET
    );

    const signer = Account.createFromPrivateKey(
      privateKey,
      NetworkType.TEST_NET
    );

    const signedTransaction = signer.sign(
      transferTransaction,
      testNetGenerationHash
    );

    const transactionHttp = new TransactionHttp(testNetUrl);
    const listener = new Listener(testNetUrl);

    listener.open().then(() => {
      const newBlockSubscription = listener
        .confirmed(signer.address)
        .pipe(
          filter(
            (transaction) =>
              transaction.transactionInfo !== undefined &&
              transaction.transactionInfo.hash === signedTransaction.hash
          ),
          mergeMap((transaction) => {
            return listener.newBlock().pipe(
              first(),
              map((ignored) => transaction)
            );
          })
        )
        .subscribe(
          (ignored) => {
            logger.info('ProximaX - ✅ Transaction confirmed');
            newBlockSubscription.unsubscribe();
            listener.close();
            resolve('success');
          },
          (error) => {
            logger.error('ProximaX - Transaction failed', error);
            reject(error);
          }
        );
    });

    transactionHttp.announce(signedTransaction).subscribe(
      (result) => {
        logger.info('ProximaX - create transaction success');
      },
      (err) => {
        logger.error('ProximaX - create transaction failed', err);
        reject(err);
      }
    );
  });
};

export { transferXpxCoin };
