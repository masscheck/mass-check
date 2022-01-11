const prefix = 'sessionAccessId-';

const getId = (data) => {
  let id;

  if (data && data.id && ~data.id.indexOf(prefix)) {
    id = data.id;
  }

  return id;
};

export default getId;
