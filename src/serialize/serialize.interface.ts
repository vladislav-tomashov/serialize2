export interface ISerializableState {
  readonly className: string;
  [key: string]: any;
}

export interface ISerializable<T extends ISerializableState> {
  serializable: true;
  readonly id: string;
  getClassName: () => string;
  getState: () => T;
  setState: (state: T) => void;
}

export function isSerializable<T extends ISerializableState>(
  value: any
): value is ISerializable<T> {
  return typeof value === "object" && !!value.serializable;
}

export interface ISerializableClass<T extends ISerializableState> {
  prototype: ISerializable<T>;
}

export type TKeyValuePair<T, K extends keyof T> = [K, T[K]];

export interface IGetProperty<T, K extends keyof T> {
  getProperty(prop: K): T[K];
}

export interface ISetProperty<T, K extends keyof T> {
  setProperty(prop: K, value: T[K]): void;
}
