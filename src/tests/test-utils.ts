const jsonReplacer = (key: string, value: any): any | undefined => {
  if (key === "_context") {
    return undefined;
  }

  return value;
};

export { jsonReplacer };
