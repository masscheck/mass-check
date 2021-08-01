import { postValidateAuthUser } from '../API/AuthUser';
import { LocalStorageEnum } from '../Constant/LocalStorageEnum';

const hasTokenExpire = () => {
  const expireTime = parseInt(
    localStorage.getItem(LocalStorageEnum.EXPIRE_TIME_TOKEN)
  );
  const hasExpire = expireTime - Date.now();

  // unit in milliseconds
  const fiveMinutes = 5 * 60 * 1000;

  // If less than 5 minutes, require user to sign in again
  return hasExpire <= fiveMinutes;
};

// return first boolean type: hasValidToken
// return second boolean type: userHasSignOut
export const hasValidTokenAccess = async () => {
  console.log('Auth user');

  const accessToken = localStorage.getItem(LocalStorageEnum.ACCESS_TOKEN);

  // No access token
  if (!accessToken) return [false, true];

  // Check token has expire
  if (hasTokenExpire()) return [false, null];

  // Validate token with server to ensure the token haven't been tampered
  // getting uid and displayName back
  try {
    const res = await postValidateAuthUser(accessToken);

    // store uid, username
    const { uid, username } = res.data;

    localStorage.setItem(LocalStorageEnum.UID, uid);
    localStorage.setItem(LocalStorageEnum.DISPLAY_NAME, username);

    return [true, null];
  } catch (err) {
    console.log('hasValidTokenAccess(): ', 'Failed to auth user');
    console.log(err);
    return [false, null];
  }
};
