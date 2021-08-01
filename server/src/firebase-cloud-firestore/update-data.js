const { db } = require('../util/firebase-config');

const updateXpxAccAddress = async (uid, address) => {
  const accRef = db.collection('accounts').doc(uid);

  try {
    const res = await accRef.update({
      xpx_address: address,
      stage: 'PROXIMAX_ACC_CREATED',
    });
  } catch (error) {
    console.log('Add address to db failed');
    console.log(error);
  }
};

module.exports = {updateXpxAccAddress}