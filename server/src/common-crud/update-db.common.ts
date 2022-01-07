import TweetModel from '../models/tweet.model';
import AccountModel from '../models/account.model';

const addUserToWIP = async (uid: string, tweetId: string, workType: string) => {
  const addUserToWIPStatus = await new Promise((resolve, reject) => {
    TweetModel.findByIdAndUpdate(
      tweetId,
      { $inc: { totalUserHadParticipants: 1 }, $push: { wipId: uid } },
      (err, result) => {
        if (err) reject(err);

        resolve(result);
      }
    );
  });

  const addWIPtoAcc = await new Promise((resolve, reject) => {
    AccountModel.findByIdAndUpdate(
      uid,
      { $push: { wipTweets: { tweetId, workType } } },
      (err, result) => {
        if (err) reject(err);

        resolve(result);
      }
    );
  });

  return [addUserToWIPStatus, addWIPtoAcc];
};

const removeUserToWIP = async (
  uid: string,
  tweetId: string,
) => {
  const removeUserToWIPStatus = await new Promise((resolve, reject) => {
    TweetModel.findByIdAndUpdate(
      tweetId,
      { $inc: { totalUserHadParticipants: -1 }, $pull: { wipId: uid } },
      (err, result) => {
        if (err) reject(err);

        resolve(result);
      }
    );
  });

  const removeWIPtoAcc = await new Promise((resolve, reject) => {
    AccountModel.findByIdAndUpdate(
      uid,
      { $pull: { wipTweets: { tweetId } } },
      (err, result) => {
        if (err) reject(err);

        resolve(result);
      }
    );
  });

  return [removeUserToWIPStatus, removeWIPtoAcc];
};

export { addUserToWIP, removeUserToWIP };
