const randomGenIndex = (length) => {
  return Math.floor(Math.random() * length);
};

const firebaseTimestampToJsDate = (timestamp) => {
  return new Date(timestamp._seconds * 1000)
}

module.exports = { randomGenIndex, firebaseTimestampToJsDate };
