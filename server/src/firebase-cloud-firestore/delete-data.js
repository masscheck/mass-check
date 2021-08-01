const { db } = require('../util/firebase-config');

const deleteToken = async (token) => {
  db.collection('jwt')
    .doc(token)
    .delete()
    .then(() => {
      console.log('Document successfully deleted!');
    })
    .catch((error) => {
      console.error('Error removing document: ', error);
    });
};

module.exports = { deleteToken };
