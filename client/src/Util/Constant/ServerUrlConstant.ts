const SERVER_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.REACT_APP_SERVER_ENDPOINT;

export default SERVER_URL;
