import { postAPIModel, getAPIModel } from './ReqAPIModel';

const ACCOUNT_API_BASE_URI = '/api/signin';

const getAccInfo = async (uid: string) => {
  return new Promise<any>(async (resolve, reject) => {
    const res = await getAPIModel(ACCOUNT_API_BASE_URI + '/retrieve-acc-info', {
      uid,
    });

    if (res.status < 300) {
      resolve(res.data);
    } else {
      reject('Failed create account');
    }
  });
};

export { getAccInfo };
