const { db } = require('../util/firebase-config');

const addInvestigateCollection = async (uid) => {
  const docRef = db.collection('accounts').doc(uid);

  return docRef.collection('investigated_tweets').doc('FAKE_ID').set({
    xpx_coin: 10,
    user_credibility: 5,
  });
};

const addVerifyCollection = async (uid) => {
  const docRef = db.collection('accounts').doc(uid);

  return docRef.collection('verify_tweets').doc('FAKE_ID').set({
    xpx_coin: 10,
    user_credibility: 3,
    voted_choice: false,
    voted_right: true,
  });
};

const createAcc = async (uid, username, email) => {
  const userDefaultCredibilityScore = 50;

  db.collection('accounts')
    .doc(uid)
    .set({
      username: username,
      email: email,
      stage: 'MASS_CHECK_ACC_CREATED',
      user_credibility: userDefaultCredibilityScore,
      submitted_tweets: [],
    })
    .then(() => {
      console.log('Acc successfully created!');

      addInvestigateCollection(uid);
      addVerifyCollection(uid);
    })
    .catch((error) => {
      console.error('Error writing document: ', error);
      throw error;
    });
};

const storeJwt = async (token) => {
  db.collection('jwt')
    .doc(token)
    .set({
      placeholder: 'JWT placeholder',
    })
    .then(() => {
      console.log('JWT Stored success created!');
    })
    .catch((err) => {
      console.err('Error store jwt: ', err);
      throw err;
    });
};

module.exports = { createAcc, storeJwt };
