// Import Library
const fs = require('fs');
const firebase = require('firebase');
const { v4: genBatchNo } = require('uuid');
const { StageConstant } = require('../constant/stage-constant');

// TODO Rmb to put the config
firebase.initializeApp({
  apiKey: 'AIzaSyAqs2Nx9kg_MEGvfjMla7ZpoSCsWtw3dNw',
  authDomain: 'masscheck-d8ece.firebaseapp.com',
  projectId: 'masscheck-d8ece',
  storageBucket: 'masscheck-d8ece.appspot.com',
  messagingSenderId: '845650642906',
  appId: '1:845650642906:web:2cf7c0bcf6b3d12aeba2e3',
});

const db = firebase.firestore();

// Read Data
let rawdata = fs.readFileSync('DummyTweetJson.json');
let data = JSON.parse(rawdata);

// Helper Function to Randomise
const randomItem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Dummy Data
let author = [
  'Harrison',
  'Curran',
  'Kira',
  'Collins',
  'Eilidh',
  'Hobbs',
  'Findlay',
  'Gregory',
  'Jemimah',
  'Sullivan',
  'Duane',
  'Owen',
  'Zishan',
  'Ross',
  'Eira',
  'Martins',
  'Ann',
  'Downs',
  'Shanae',
  'Hamer',
];

let submitUser = [
  'Kurt',
  'Daugherty',
  'Cydney',
  'Obrien',
  'Greyson',
  'Senior',
  'Kirk',
  'Marshall',
  'Herman',
  'Humphrey',
  'Maisy',
  'Nixon',
  'Naomi',
  'Lindsay',
  'Nettie',
  'Oconnell',
  'Judith',
  'Medrano',
  'Subhaan',
  'Ashton',
];

// Combine Data Together into Array
let arr = [];
let batchList = [];
let batchNo;
const batchSize = 10;
for (let i = 0; i < 50; i++) {
  if (i % batchSize === 0) {
    batchNo = genBatchNo();
    batchList.push(batchNo);
  }

  let curAuthor = randomItem(author);

  let obj = {
    author_name: curAuthor,
    author_tag: `@${curAuthor.toLowerCase()}`,
    content: data['tweet'][i],
    submit_by: randomItem(submitUser),
    submit_time: firebase.firestore.FieldValue.serverTimestamp(),
    stage: StageConstant.QUEUEING,
    ai_score: null,
    trust_index: null,
    crowd_voted_result: null,
    max_user: 5,
    num_user_participated: 0,
    investigators: [],
    jurors: [],
    batch_no: batchNo,
    investigated_report_id_list: [],
  };

  arr.push(obj);
}

// Batch Tweet upload to firebase
const batch_tweet = db.batch();

for (let i = 0; i < arr.length; i++) {
  documentData = arr[i];

  const ref = db.collection('tweets').doc(`${i + 1}`);
  batch_tweet.set(ref, documentData);
}

batch_tweet.commit().then(() => {
  console.log('Uploading tweets...');
});

// Batch Batch Number to firebase
const batch_batch_no = db.batch();

for (let i = 0; i < batchList.length; i++) {
  documentId = batchList[i];
  prefixDigit = i * 10;

  documentData = [];
  for (let n = 1; n <= 10; n++) {
    documentData.push(prefixDigit + n);
  }

  const ref = db.collection('batch').doc(documentId);
  batch_batch_no.set(ref, { tweet_id: documentData });
}

batch_batch_no.commit().then(() => {
  console.log('Uploading batch...');
});

// Batch Batch Number List to firebase
const batch_batch_list = db.batch();

const ref = db.collection('batch_list').doc('list');
batch_batch_list.set(ref, { list: batchList });

batch_batch_list.commit().then(() => {
  console.log('Uploading batch list...');
});

// Add unverified tweets to firebase
const unverified_tweet_id_list = [];

for (let i = 1; i <= arr.length; i++) {
  unverified_tweet_id_list.push(i);
}

const unverified_tweet_id_ref = db
  .collection('tweets_status')
  .doc('unverified');

unverified_tweet_id_ref.set({
  tweet_id: unverified_tweet_id_list,
}).then(res => {
  console.log('Upload unverified tweets')
});
