import { LocalStorageEnum } from '../Constant/LocalStorageEnum';

const hasTokenExpire = () => {
  // Check has access token or not
  const accessToken = localStorage.getItem(LocalStorageEnum.ACCESS_TOKEN);
  if (!accessToken) return false;

  const expireTime = parseInt(
    localStorage.getItem(LocalStorageEnum.EXPIRE_TIME_TOKEN)
  );
  const hasExpire = expireTime - Date.now();

  // unit in milliseconds
  const fifteenMinutes = 15 * 60 * 1000;

  // If less than 15 minutes, require user to sign in again
  return hasExpire <= fifteenMinutes;
};

export { hasTokenExpire };
