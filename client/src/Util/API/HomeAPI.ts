import { getAPIModel } from './ReqAPIModel';

const HOME_BASE_URL = '/api/home';

const getVerifiedTweetList = async (nextVerifiedTweetStartDate) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const res = await getAPIModel(
        HOME_BASE_URL + '/retrieve-verified-tweet-list',
        {
          nextVerifiedTweetStartDate,
        }
      );

      resolve(res.data);
    } catch (err) {
      reject(err);
    }
  });
};

const getUnverifiedTweetList = async (nextUnverifiedTweetStartDate) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const res = await getAPIModel(
        HOME_BASE_URL + '/retrieve-unverified-tweet-list',
        {
          nextUnverifiedTweetStartDate,
        }
      );

      resolve(res.data);
    } catch (err) {
      reject(err);
    }
  });
};

export { getVerifiedTweetList, getUnverifiedTweetList };
