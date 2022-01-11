const connectId = 'sessionAccessId-connected';

const get = (event, data) => {
  event.source.postMessage(
    {
      id: data.id,
      data: window.localStorage.getItem(data.key),
    },
    event.origin
  );
};

const set = (event, data) => {
  window.localStorage.setItem(data.key, data.value);

  event.source.postMessage(
    {
      id: data.id,
    },
    event.origin
  );
};

const remove = (event, data) => {
  window.localStorage.removeItem(data.key);

  event.source.postMessage(
    {
      id: data.id,
    },
    event.origin
  );
};

const connect = (event) => {
  event.source.postMessage(
    {
      id: connectId,
    },
    event.origin
  );
};

const methods = { get, set, remove, connect }

export default methods;
