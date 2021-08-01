const { db } = require('../util/firebase-config');

const createAcc = async (uid, username, email) => {
  db.collection('accounts')
    .doc(uid)
    .set({
      username: username,
      email: email,
      stage: 'MASS_CHECK_ACC_CREATED',
    })
    .then(() => {
      console.log('Acc successfully created!');
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
