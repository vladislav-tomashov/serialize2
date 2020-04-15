export interface IGetProperty<T, K extends keyof T> {
  getProperty(prop: K): T[K];
}

export interface ISetProperty<T, K extends keyof T> {
  setProperty(prop: K, value: T[K]): void;
}

export interface ISerializableState {
  readonly className: string;
  readonly id: string;
  [key: string]: any;
}

export interface ISerializable {
  serializable: true;
  readonly id: string;
  getClassName: () => string;
  getState: () => ISerializableState;
  setState: (state: ISerializableState) => void;
}

export function isSerializable(value: any): value is ISerializable {
  return typeof value === "object" && !!value.serializable;
}

export interface ISerializableClass {
  prototype: ISerializable;
}
