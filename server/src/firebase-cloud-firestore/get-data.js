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
  } catch (error) {
    throw error;
  }
};

module.exports = { getUserInfo };
