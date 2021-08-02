import { postAPIModel } from './ReqAPIModel';

const getUserInfoByUid = async (uid: string) => {
  return await postAPIModel('/api/get-userinfo', { uid });
};

export { getUserInfoByUid };
