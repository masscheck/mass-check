import axios from 'axios';

import API_URL from '../Constant/ServerUrlConstant';
import { LocalStorageEnum } from '../Constant/LocalStorageEnum';
import { hasTokenExpire } from '../Useful/CheckTokenExpiration';

const token = localStorage.getItem(LocalStorageEnum.ACCESS_TOKEN);

const renewAccessToken = async () => {
  console.log('Renew Token');
  const refreshToken = localStorage.getItem(LocalStorageEnum.REFRESH_TOKEN);

  const res = await axios.post(`${API_URL}/refresh-token`, {
    token: refreshToken,
  });

  const { accessToken, expireTime } = res.data;

  localStorage.setItem(LocalStorageEnum.ACCESS_TOKEN, accessToken);
  localStorage.setItem(LocalStorageEnum.EXPIRE_TIME_TOKEN, expireTime);
};

const postAPIModel = async (url, body = {}, header = {}) => {
  console.log(token);
  if (hasTokenExpire()) {
    await renewAccessToken();
  }

  return await axios.post(`${API_URL}${url}`, body, {
    headers: {
      // 'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
      ...header,
    },
  });
};

const getAPIModel = async (url, header = {}) => {
  return await axios.get(`${API_URL}${url}`, {
    headers: {
      // 'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
      ...header,
    },
  });
};

const deleteAPIModel = async (url, header = {}) => {
  return await axios.delete(`${API_URL}${url}`, {
    headers: {
      // 'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
      ...header,
    },
  });
};

export { postAPIModel, getAPIModel, deleteAPIModel };
