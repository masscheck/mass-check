import { getAPIModel } from './ReqAPIModel';

const getVerifiedTweetList = async () => {
  return await getAPIModel('/api/home/get-verified-tweets');
};

const getUnverifiedTweetList = async () => {
  return await getAPIModel('/api/home/get-unverified-tweets');
};

export { getVerifiedTweetList, getUnverifiedTweetList };
