import {
  IChange,
  TSerializableValue,
  IChanges,
  ISerializable,
} from "../serializable-object/interfaces";
import { IArrayCollection } from "../../collections";

export type TCollectionPushChange<T> = T[];

export type TCollectionAllChange<T> = T[];

export type TCollectionSetChange<T> = [number, T];

export type TCollectionUnshiftChange<T> = T[];

export type TCollectionSpliceChange<T> = [
  number,
  number | undefined,
  T[] | undefined
];

export type TCollectionChange<T> =
  | TCollectionPushChange<T>
  | TCollectionAllChange<T>
  | TCollectionSetChange<T>
  | TCollectionUnshiftChange<T>
  | TCollectionSpliceChange<T>;

export interface ICollectionChange extends IChange {
  d?: TCollectionChange<TSerializableValue>;
}
export interface ICollectionChanges extends IChanges {
  log: ICollectionChange[];
}

export interface ISerializableCollection<T>
  extends ISerializable<T[]>,
    IArrayCollection<T> {}
