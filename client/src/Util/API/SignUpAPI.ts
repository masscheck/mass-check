import { postAPIModel } from './ReqAPIModel';

const postCreateAcc = async (uid: string, email: string, username: string) => {
  await postAPIModel('/api/create-acc', {
    uid: uid,
    email: email,
    username: username,
  });
};

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

export { postCreateAcc, downloadPrivateKey, storeXpxAddress };
