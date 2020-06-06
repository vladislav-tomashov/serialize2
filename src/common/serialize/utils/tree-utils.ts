export const reduceTree = <T>(
  root: any,
  getNodes: (node: any) => any[],
  reducer: (accumulator: T, node: any) => T,
  initialValue: T,
): T => {
  return getNodes(root).reduce((accumulator, node) => {
    return reduceTree(node, getNodes, reducer, accumulator);
  }, reducer(initialValue, root));
};

export const treeToArray = (
  root: any,
  getNodes: (node: any) => any[],
): any[] => {
  const reducer = (accumulator: any[], node: any) => {
    return [node, ...accumulator];
  };
  return reduceTree(root, getNodes, reducer, []);
};
