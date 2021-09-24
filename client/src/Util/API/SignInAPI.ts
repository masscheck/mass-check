import { getAPIModel } from './ReqAPIModel';

const SIGN_IN_API_BASE_URI = '/api/signin';

const getAccInfo = async (uid: string) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const res = await getAPIModel(
        SIGN_IN_API_BASE_URI + '/retrieve-acc-info',
        {
          uid,
        }
      );

      resolve(res.data);
    } catch (err) {
      console.error(err);

      reject({ message: 'Failed to get account info' });
    }
  });
};

export { getAccInfo };
