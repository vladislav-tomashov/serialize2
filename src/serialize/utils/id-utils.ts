let _id = 0;

const getId = (): string => {
  _id = _id + 1;
  return `${_id}`;
};

export { getId };
