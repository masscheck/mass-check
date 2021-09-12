const { StageConstant } = require('../constant/stage-constant');
const { db, admin } = require('../util/firebase-config');

const updateXpxAccAddress = async (uid, address) => {
  const accRef = db.collection('accounts').doc(uid);

  try {
    await accRef.update({
      xpx_address: address,
      stage: 'PROXIMAX_ACC_CREATED',
    });
  } catch (error) {
    console.log('Add address to db failed');
    console.log(error);
  }
};

const updateTweetStageToInvestigating = async (tweetId) => {
  const tweetRef = db.collection('tweets').doc(`${tweetId}`);

  try {
    await tweetRef.update({
      stage: StageConstant.INVESTIGATING,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateTweetThatUserAgreeToInvestigating = async (tweetId, uid) => {
  const tweetRef = db.collection('tweets').doc(`${tweetId}`);

  try {
    await tweetRef.update({
      investigators: admin.firestore.FieldValue.arrayUnion(uid),
    });
  } catch (error) {
    console.log(error);
  }
};

const updateTweetUponSubmitDocument = async (uid, tweetId, reportId) => {
  const tweetRef = db.collection('tweets').doc(`${tweetId}`);

  try {
    await tweetRef.update({
      investigated_report_id_list:
        admin.firestore.FieldValue.arrayUnion(reportId),
      stage: StageConstant.INVESTIGATING,
      num_user_participated: admin.firestore.FieldValue.increment(1),
    });
  } catch (error) {
    console.log(error);
  }
};

const updateUserProfileUponSubmitDocument = async (
  uid,
  tweetId,
  xpxCoin,
  crediblityScore
) => {
  const accRef = db.collection('accounts').doc(uid);

  try {
    await accRef.update({
      user_credibility: admin.firestore.FieldValue.increment(crediblityScore),
    });

    await accRef.collection('investigated_tweets').doc(`${tweetId}`).set({
      xpx_coin: xpxCoin,
      user_credibility: crediblityScore,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  updateXpxAccAddress,
  updateTweetStageToInvestigating,
  updateTweetThatUserAgreeToInvestigating,
  updateTweetUponSubmitDocument,
  updateUserProfileUponSubmitDocument,
};
