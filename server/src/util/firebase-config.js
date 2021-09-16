const admin = require('firebase-admin');
const firebase = require('firebase');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(
      Buffer.from(process.env.FIREBASE_CONFIG, 'base64').toString('ascii')
    )
  ),
});

const db = admin.firestore();

module.exports = { db, admin, firebase };
