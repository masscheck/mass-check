import { getAPIModel } from './ReqAPIModel';

const USER_PROFILE_BASE_URI = '/api/user-profile';

const getAccountInfo = async (uid) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const res = await getAPIModel(
        USER_PROFILE_BASE_URI + '/retrieve-user-info',
        {
          uid,
        }
      );

      resolve(res.data);
    } catch (err) {
      reject(err);
    }
  });
};

const getXpxBalance = async (xpxAddress) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const res = await getAPIModel(
        USER_PROFILE_BASE_URI + '/retrieve-xpx-balance',
        {
          xpxAddress,
        }
      );

      resolve(res.data);
    } catch (err) {
      reject(err);
    }
  });
};

export { getAccountInfo, getXpxBalance };
