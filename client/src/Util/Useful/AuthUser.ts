import { postValidateAuthUser } from '../API/AuthAPI';
import { LocalStorageEnum } from '../Constant/LocalStorageEnum';
import { hasTokenExpire } from './CheckTokenExpiration';

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
    const res = await postValidateAuthUser();

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
