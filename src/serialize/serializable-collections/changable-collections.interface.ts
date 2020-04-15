export enum CollectionChangeType {
  Push,
  Pop,
  Clear,
  Sort,
  Reverse,
  Splice,
  Set,
  Shift,
  Unshift,
}

export type TCollectionPushChange<T> = [CollectionChangeType.Push, T[]];

export type TCollectionPopChange = [CollectionChangeType.Pop];

export type TCollectionClearChange<T> = [CollectionChangeType.Clear, T[]];

export type TCollectionSortChange<T> = [CollectionChangeType.Sort, T[]];

export type TCollectionReverseChange<T> = [CollectionChangeType.Reverse, T[]];

export type TCollectionSetChange<T> = [CollectionChangeType.Set, number, T];

export type TCollectionUnshiftChange<T> = [CollectionChangeType.Unshift, T[]];

export type TCollectionShiftChange = [CollectionChangeType.Shift];

export type TCollectionSpliceChange<T> = [
  CollectionChangeType.Splice,
  number,
  number | undefined,
  T[] | undefined,
];

export type TCollectionChange<T> =
  | TCollectionPushChange<T>
  | TCollectionPopChange
  | TCollectionClearChange<T>
  | TCollectionSortChange<T>
  | TCollectionReverseChange<T>
  | TCollectionSetChange<T>
  | TCollectionUnshiftChange<T>
  | TCollectionShiftChange
  | TCollectionSpliceChange<T>;
