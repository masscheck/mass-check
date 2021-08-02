const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Initialise the express app
const app = express();

// Route
const downloadPrivateKeyRoute = require('./route/download-pk.route');
const createAcc = require('./route/create-acc.route');
const getUserInfo = require('./route/get-user-info.route');
const auth = require('./route/auth.route');

// Config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routing
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Authenticate user
app.use('/api', auth);

// Validate Authenticated User to Access the API only
// TODO activate back
app.use('/api', (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    console.log('Decoded: ', decoded);

    if (err) return res.sendStatus(403);

    req.decoded = decoded;
    next();
  });
});

app.use('/api', downloadPrivateKeyRoute);
app.use('/api', createAcc);
app.use('/api', getUserInfo);

app.use('/', (req, res, next) => {
  res.send('MassCheck API');
});

// Listen to specific port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Local server port number:', port);
});
