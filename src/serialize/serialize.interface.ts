import { TCollectionChange } from "./serializable-collections/changable-collections.interface";

export interface ISerializableState {
  readonly className: string;
  [key: string]: any;
}

export interface ISerializable<
  T extends ISerializableState,
  K extends keyof T
> {
  serializable: true;
  readonly id: string;
  getClassName: () => string;
  getState: () => T;
  setState: (state: T) => void;
  applyChanges(changes: TKeyValuePair<T, K>[]): void;
}

export function isSerializable<T extends ISerializableState, K extends keyof T>(
  value: any
): value is ISerializable<T, K> {
  return typeof value === "object" && !!value.serializable;
}

export interface ISerializableClass<
  T extends ISerializableState,
  K extends keyof T
> {
  prototype: ISerializable<T, K>;
}

export type TKeyValuePair<T, K extends keyof T> = [K, T[K]];

export interface IGetProperty<T, K extends keyof T> {
  getProperty(prop: K): T[K];
}

export interface ISetProperty<T, K extends keyof T> {
  setProperty(prop: K, value: T[K]): void;
}

export type TChanges = TKeyValuePair<any, any>[] | TCollectionChange<any>[];

export interface IChangeObject {
  readonly disabled: boolean;
  readonly hasEntries: boolean;
  disable(): void;
  enable(): void;
  clear(): void;
  getChanges(source: any): TChanges;
}
