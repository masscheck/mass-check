import {
  Account,
  AccountHttp,
  Address,
  MosaicHttp,
  MosaicService,
  NetworkType,
} from 'tsjs-xpx-chain-sdk';
import { testNetUrl } from './xpx-info.xpx';

interface xpxAccountCreatedInterface {
  privateKey: string;
  address: string;
}

const accountHttp = new AccountHttp(testNetUrl);
const mosaicHttp = new MosaicHttp(testNetUrl);

const createXpxAcc = () => {
  return new Promise<xpxAccountCreatedInterface>((resolve, reject) => {
    try {
      const account = Account.generateNewAccount(NetworkType.TEST_NET);
      const { privateKey, address } = account;

      resolve({ privateKey, address: address.plain() });
    } catch (err) {
      reject(err);
    }
  });
};

const getXpxAccBalance = (rawAddress: string) => {
  return new Promise<any>((resolve, reject) => {
    try {
      const address = Address.createFromRawAddress(rawAddress);

      const mosaicService = new MosaicService(accountHttp, mosaicHttp);

      mosaicService.mosaicsAmountViewFromAddress(address).subscribe((res) => {
        res.forEach((element) => {
          resolve(element.relativeAmount());
        });
      });
    } catch (err) {
      reject(err);
    }
  });
};

export { createXpxAcc, getXpxAccBalance };
