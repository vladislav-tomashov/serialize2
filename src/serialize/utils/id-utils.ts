let _id = 0;

const getId = (): string => {
  _id = _id + 1;
  return `${_id}`;
};

const setId = (id: number): void => {
  if (id <= _id) {
    throw new Error(
      `Argiment id=${id} cannot be less or equal to existing _id=${_id}.`
    );
  }

  _id = id;
};

export { getId, setId };
