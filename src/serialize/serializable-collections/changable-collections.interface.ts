import {
  IChanges,
  IChange,
  TSerializableValue,
  ISerializable,
} from "../serialize.interface";
import { IArrayCollection } from "../../collections/collections.interface";

export enum CollectionChangeType {
  Push = "Push",
  Pop = "Pop",
  Splice = "Splice",
  Set = "Set",
  Shift = "Shift",
  Unshift = "Unshift",
  All = "All",
}

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
  data: TCollectionChange<TSerializableValue> | undefined;
}
export interface ICollectionChanges extends IChanges {
  log: ICollectionChange[];
}

export interface IChangableArrayCollection<T>
  extends ISerializable,
    IArrayCollection<T> {}
