import axios from 'axios';

import API_URL from './ServerUrl';
import { LocalStorageEnum } from '../Constant/LocalStorageEnum';

const postValidateAuthUser = async (token) => {
  return await axios.post(
    `${API_URL}/api/is-authenticated`,
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const postCreateToken = async (uid, username) => {
  const res = await axios.post(`${API_URL}/api/create-token`, {
    payload: { uid, username },
  });

  const { accessToken, refreshToken, expireTime } = res.data;

  localStorage.setItem(LocalStorageEnum.ACCESS_TOKEN, accessToken);
  localStorage.setItem(LocalStorageEnum.REFRESH_TOKEN, refreshToken);
  localStorage.setItem(LocalStorageEnum.EXPIRE_TIME_TOKEN, expireTime);
  localStorage.setItem(LocalStorageEnum.IS_SIGN_IN, 'true');
};

export { postValidateAuthUser, postCreateToken };
