import { postAPIModel } from './ReqAPIModel';

const ACCOUNT_API_BASE_URI = '/api/signup';

const postCreateAcc = async (uid: string, email: string, username: string) => {
  return new Promise<any>(async (resolve, reject) => {
    const res = await postAPIModel(ACCOUNT_API_BASE_URI + '/create-acc', {
      uid,
      email,
      username,
    });

    if (res.status < 300) {
      resolve('Success create account');
    } else {
      reject('Failed create account');
    }
  });
};

const postCreateXpxAcc = async () => {
  return new Promise<any>(async (resolve, reject) => {
    const res = await postAPIModel(ACCOUNT_API_BASE_URI + '/create-xpx-acc');

    if (res.status < 300) {
      resolve(res.data);
    } else {
      reject('Failed create account');
    }
  });
};

// below refactor

const downloadPrivateKey = async () => {
  const res = await postAPIModel('/api/download-private-key');

  return res;
};

const storeXpxAddress = async (uid: string, address: string) => {
  const res = await postAPIModel('/api/store-xpx-address', {
    uid,
    address,
  });

  return res;
};

export { postCreateAcc, postCreateXpxAcc, downloadPrivateKey, storeXpxAddress };
