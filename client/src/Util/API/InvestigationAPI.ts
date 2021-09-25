import { postAPIModel, getAPIModel } from './ReqAPIModel';

const INVESTIGATION_BASE_URI = '/api/investigation';

const getInvestigationJob = async (uid: string) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const res = await getAPIModel(INVESTIGATION_BASE_URI + '/get-job', {
        uid,
      });

      resolve(res.data.tweetInfo);
    } catch (err) {
      reject(err);
    }
  });
};

const userCancelledInvestigationJob = async (uid: string, tweetId: string) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      await postAPIModel(INVESTIGATION_BASE_URI + '/user-cancel-job', {
        uid,
        tweetId,
      });

      resolve('Cancel');
    } catch (err) {
      reject(err);
    }
  });
};

const systemCancelledInvestigationJob = async (
  uid: string,
  tweetId: string
) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      await postAPIModel(INVESTIGATION_BASE_URI + '/system-time-out', {
        uid,
        tweetId,
      });

      resolve('Cancel');
    } catch (err) {
      reject(err);
    } finally {

    }
  });
};

const submitReport = async (uid: string, tweetId: string, reportId: string, xpxAddress: string) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      await postAPIModel(INVESTIGATION_BASE_URI + '/submit-report', {
        uid,
        tweetId,
        reportId,
        xpxAddress
      });

      resolve('Submitted');
    } catch (err) {
      reject(err);
    }
  });
};

export {
  getInvestigationJob,
  userCancelledInvestigationJob,
  systemCancelledInvestigationJob,
  submitReport,
};
