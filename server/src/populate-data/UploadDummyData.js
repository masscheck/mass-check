// Import Library
const fs = require('fs');
const firebase = require('firebase');

// TODO Rmb to put the config
firebase.initializeApp({});

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

for (let i = 0; i < 50; i++) {
  let curAuthor = randomItem(author);

  let obj = {
    author_name: curAuthor,
    author_tag: `@${curAuthor.toLowerCase()}`,
    content: data['tweet'][i],
    submit_by: randomItem(submitUser),
    submit_time: Date(),
    stage: 'queueing',
    ai_score: null,
    trust_index: null,
    crowd_voted_result: null,
    max_user: 5,
    num_user_participated: 0,
    investigators: [],
    jurors: [],
  };

  arr.push(obj);
}

// Batch upload to firebase
const batch = db.batch();

for (let i = 0; i < 50; i++) {
  documentData = arr[i];

  const ref = db.collection('tweets').doc(`${i + 1}`);
  batch.set(ref, documentData);
}

// Commit the batch
batch.commit().then(() => {
  console.log('Uploading...');
});
