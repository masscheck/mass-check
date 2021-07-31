const SERVER_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : 'https://mass-check-server.herokuapp.com';

export default SERVER_URL;
