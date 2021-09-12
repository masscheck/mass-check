import { postAPIModel, getAPIModel } from './ReqAPIModel';

const matchTweetInvestigation = async () => {
  return await getAPIModel('/api/queue-investigation');
};

const retrieveTweetInfo = async (uid: string, tweetId: string) => {
  return await postAPIModel('/api/retrieve-tweet-info-for-investigating', {
    uid,
    tweetId,
  });
};

const submitReport = async (uid: string, tweetId: string, reportId: string) => {
  console.log({ fe: { uid, tweetId, reportId } });

  return await postAPIModel('/api/submit-report', { uid, tweetId, reportId });
};

export { matchTweetInvestigation, retrieveTweetInfo, submitReport };
