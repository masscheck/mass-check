const { db } = require('../util/firebase-config');
const { firebaseTimestampToJsDate } = require('../util/helper-function');
const { StageConstant } = require('../constant/stage-constant');

const getUserInfo = async (uid) => {
  const accRef = db.collection('accounts').doc(uid);

  try {
    const result = await accRef.get();
    const { username, address, stage } = result.data();

    return {
      username,
      address,
      stage,
    };
  } catch (err) {
    throw err;
  }
};

const isTokenInDb = async (token) => {
  const accRef = db.collection('jwt').doc(token);

  try {
    await accRef.get();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getBatchList = async () => {
  const batchListRef = db.collection('batch_list').doc('list');

  try {
    const result = await batchListRef.get();

    const { list } = result.data();

    return list;
  } catch (err) {
    throw err;
  }
};

const getTweetIdList = async (batchId) => {
  const batchRef = db.collection('batch').doc(batchId);

  try {
    const result = await batchRef.get();

    const { tweet_id: tweetIdList } = result.data();

    return tweetIdList;
  } catch (err) {
    throw err;
  }
};

const getTweetInfo = async (tweetId) => {
  const tweetRef = db.collection('tweets').doc(`${tweetId}`);

  try {
    const result = await tweetRef.get();

    let res = result.data();
    res = { ...res, submit_time: firebaseTimestampToJsDate(res.submit_time) };

    console.log(res);

    return res;
  } catch (err) {
    throw err;
  }
};

const getTweetToBeVerify = async () => {
  const tweetRef = db.collection('tweets');
  const query = tweetRef.where('num_user_participated', '>=', 5);
  const queryResult = [];

  try {
    const querySnapshot = await query.get();
    querySnapshot.forEach((doc) => {
      queryResult.push(doc.data());
    });

    return queryResult;
  } catch (err) {
    throw err;
  }
};

const getUnverifiedTweetIdList = async () => {
  const tweetRef = db.collection('tweets');
  const query = tweetRef
    .where('stage', '!=', StageConstant.COMPLETE)
    .limit(10)
  const queryResult = [];

  try {
    const querySnapshot = await query.get();
    querySnapshot.forEach((doc) => {
      queryResult.push(doc.data());
    });

    return queryResult;
  } catch (err) {
    throw err;
  }
};

const getVerifiedTweetIdList = async () => {
  const tweetRef = db.collection('tweets');
  const query = tweetRef
    .where('stage', '==', StageConstant.COMPLETE)
    .limit(10)
  const queryResult = [];

  try {
    const querySnapshot = await query.get();
    querySnapshot.forEach((doc) => {
      queryResult.push(doc.data());
    });

    return queryResult;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getUserInfo,
  isTokenInDb,
  getBatchList,
  getTweetIdList,
  getTweetInfo,
  getTweetToBeVerify,
  getUnverifiedTweetIdList,
  getVerifiedTweetIdList
};
