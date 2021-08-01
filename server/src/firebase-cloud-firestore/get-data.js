const { db } = require('../util/firebase-config');

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

module.exports = { getUserInfo, isTokenInDb };
