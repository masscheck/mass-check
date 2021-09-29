import {
  Account,
  Address,
  NetworkType,
  Deadline,
  NetworkCurrencyMosaic,
  PlainMessage,
  TransferTransaction,
  TransactionHttp,
} from 'tsjs-xpx-chain-sdk';

import { privateKey, testNetGenerationHash, testNetUrl } from './xpx-info.xpx';

const transferXpxCoin = (recipientRawAddress: string, xpxAmount: number, message: string) => {
  return new Promise<any>((resolve, reject) => {
    const recipientAddress = Address.createFromRawAddress(recipientRawAddress);

    const transferTransaction = TransferTransaction.create(
      Deadline.create(),
      recipientAddress,
      [NetworkCurrencyMosaic.createRelative(xpxAmount)],
      PlainMessage.create(message),
      NetworkType.TEST_NET
    );

    const account = Account.createFromPrivateKey(
      privateKey,
      NetworkType.TEST_NET
    );

    const signedTransaction = account.sign(
      transferTransaction,
      testNetGenerationHash
    );

    const transactionHttp = new TransactionHttp(testNetUrl);

    console.log({ hash: signedTransaction.hash });

    transactionHttp.announce(signedTransaction).subscribe(
      (result) => {
        resolve('transfer success');
      },
      (err) => {
        console.error(err);
        reject('transfer failed');
      }
    );
  });
};

export { transferXpxCoin };
