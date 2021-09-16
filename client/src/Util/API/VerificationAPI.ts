import { postAPIModel, getAPIModel } from './ReqAPIModel';

const matchTweetVerification = async () => {
  return await getAPIModel('/api/queue-verification');
};

const retrieveTweetInfo = async (uid: string, tweetId: string) => {
  return await postAPIModel('/api/retrieve-tweet-info-for-verification', {
    uid,
    tweetId,
  });
};

const submitVerificationResult = async (
  uid: string,
  tweetId: string,
  isTweetReal: boolean
) => {
  return await postAPIModel('/api/submit-verification-tweet', {
    uid,
    tweetId,
    isTweetReal,
  });
};

export { matchTweetVerification, retrieveTweetInfo, submitVerificationResult };
