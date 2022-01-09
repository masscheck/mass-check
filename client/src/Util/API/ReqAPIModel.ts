import axios from 'axios';

import API_URL from '../Constant/ServerUrlConstant';
import { LocalStorageEnum } from '../Constant/LocalStorageEnum';
import { hasTokenExpire } from '../Useful/CheckTokenExpiration';

const renewAccessToken = async () => {
  console.log('Renew Token');
  const refreshToken = localStorage.getItem(LocalStorageEnum.REFRESH_TOKEN);

  const res = await axios.post(`${API_URL}/api/auth/refresh-token`, {
    refreshToken: refreshToken,
  });

  const { accessToken, expireTime } = res.data;

  localStorage.setItem(LocalStorageEnum.ACCESS_TOKEN, accessToken);
  localStorage.setItem(LocalStorageEnum.EXPIRE_TIME_TOKEN, expireTime);
};

const postAPIModel = async (url, body = {}, headers = {}) => {
  const token = localStorage.getItem(LocalStorageEnum.ACCESS_TOKEN);

  if (hasTokenExpire()) {
    await renewAccessToken();
  }

  return await axios.post(`${API_URL}${url}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers,
    },
  });
};

const getAPIModel = async (url, params = {}, headers = {}) => {
  const token = localStorage.getItem(LocalStorageEnum.ACCESS_TOKEN);

  if (hasTokenExpire()) {
    await renewAccessToken();
  }

  return await axios.get(`${API_URL}${url}`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers,
    },
  });
};

export { postAPIModel, getAPIModel };
