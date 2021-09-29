import { postAPIModel, getAPIModel } from './ReqAPIModel';

const VERIFICATION_BASE_URI = '/api/verification';

const getVerificationJob = async (uid: string) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const res = await getAPIModel(VERIFICATION_BASE_URI + '/get-job', {
        uid,
      });

      resolve(res.data.tweetInfo);
    } catch (err) {
      reject(err);
    }
  });
};


const userAcceptVerificationJob = async (uid: string, tweetId: string) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      await postAPIModel(VERIFICATION_BASE_URI + '/user-accept-job', {
        uid,
        tweetId,
      });

      resolve('Cancel');
    } catch (err) {
      reject(err);
    }
  });
};

const userCancelledInvestigationJob = async (uid: string, tweetId: string) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      await postAPIModel(VERIFICATION_BASE_URI + '/user-cancel-job', {
        uid,
        tweetId,
      });

      resolve('Cancel');
    } catch (err) {
      reject(err);
    }
  });
};

const systemCancelledVerificationJob = async (
  uid: string,
  tweetId: string
) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      await postAPIModel(VERIFICATION_BASE_URI + '/system-time-out', {
        uid,
        tweetId,
      });

      resolve('Cancel');
    } catch (err) {
      reject(err);
    }
  });
};

const submitVerificationResult = async (
  uid: string,
  xpxAddress: string,
  tweetId: string,
  isTweetReal: boolean
) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      await postAPIModel(VERIFICATION_BASE_URI + '/submit-tweet-verification', {
        uid,
        xpxAddress,
        tweetId,
        isTweetReal,
      });

      resolve('Submitted');
    } catch (err) {
      reject(err);
    }
  });
};

export {
  getVerificationJob,
  userCancelledInvestigationJob,
  userAcceptVerificationJob,
  systemCancelledVerificationJob,
  submitVerificationResult,
};
