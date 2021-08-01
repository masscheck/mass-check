const express = require('express');
const cors = require('cors');
// const path = require('path');
// const enforce = require('express-sslify')

// Route
const downloadPrivateKeyRoute = require('./route/download-pk.route');
const createAcc = require('./route/create-acc.route');
const getUserInfo = require('./route/get-user-info.route');
const auth = require('./route/auth.route');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Validate Authenticated User to Access the API only
app.use('/api', (req, res, next) => {
  console.log('hi');
  next();
});

app.use('/api', downloadPrivateKeyRoute);
app.use('/api', createAcc);
app.use('/api', getUserInfo);
app.use('/api', auth);

app.use('/', (req, res, next) => {
  res.send('MassCheck API');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Local server port number:', port);
});
