import axios from 'axios';

import SERVER_URL from './ServerUrl';

const getUserInfoByUid = async (uid: string) => {
  return await axios.post(
    `${SERVER_URL}/api/get-userinfo`,
    {
      uid: uid,
    },
    { headers: { 'Access-Control-Allow-Origin': '*' } }
  );
};

export { getUserInfoByUid };
