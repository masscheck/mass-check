import { LocalStorageEnum } from '../Constant/LocalStorageEnum';

import { postAPIModel } from './ReqAPIModel';

const postValidateAuthUser = async () => {
  return await postAPIModel('/api/is-authenticated');
};

const postCreateToken = async (uid, username) => {
  const res = await postAPIModel('/api/create-token', {
    payload: { uid, username },
  })

  const { accessToken, refreshToken, expireTime } = res.data;

  localStorage.setItem(LocalStorageEnum.ACCESS_TOKEN, accessToken);
  localStorage.setItem(LocalStorageEnum.REFRESH_TOKEN, refreshToken);
  localStorage.setItem(LocalStorageEnum.EXPIRE_TIME_TOKEN, expireTime);
  localStorage.setItem(LocalStorageEnum.IS_SIGN_IN, 'true');
};

export { postValidateAuthUser, postCreateToken };
