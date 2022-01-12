import { LocalStorageEnum } from '../Constant/LocalStorageEnum';
import { getAPIModel, postAPIModel } from './ReqAPIModel';

const AUTH_API_BASE_URI = '/api/auth';

const getAuth = async () => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const res = await getAPIModel(AUTH_API_BASE_URI);

      resolve(res);
    } catch (err) {
      console.error(err);

      reject({ message: 'Failed to get auth user' });
    }
  });
};

const postCreateToken = async (uid: string) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const res = await postAPIModel(AUTH_API_BASE_URI + '/create-token', {
        uid,
      });

      const { accessToken, refreshToken, expiredTime } = res.data;

      localStorage.setItem(LocalStorageEnum.UID, uid);
      localStorage.setItem(LocalStorageEnum.ACCESS_TOKEN, accessToken);
      localStorage.setItem(LocalStorageEnum.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(LocalStorageEnum.EXPIRE_TIME_TOKEN, expiredTime);

      resolve('set success');
    } catch (err) {
      console.error(err);

      reject({ message: 'Failed to create auth token' });
    }
  });
};

const postDeleteToken = async (refreshToken: string) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      await postAPIModel(AUTH_API_BASE_URI + '/delete-token', {
        refreshToken,
      });

      resolve('delete success');
    } catch (err) {
      console.error(err);

      reject({ message: 'Failed to delete auth token' });
    }
  });
};

export { getAuth, postCreateToken, postDeleteToken };
