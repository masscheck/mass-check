const SERVER_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : 'https://shielded-beyond-41981.herokuapp.com/';

export default SERVER_URL;
