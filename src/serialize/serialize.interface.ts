export interface ISerializable {
  serializable: true;
  readonly id: string;
  getClassName: () => string;
  applyChanges(changes: IChanges): void;
}

export function isSerializable(value: any): value is ISerializable {
  return typeof value === "object" && !!value.serializable;
}

export interface ISerializableClass {
  prototype: ISerializable;
}

export type TKeyValuePair<T, K extends keyof T> = [K, T[K]];

export interface IGetProperty<T, K extends keyof T> {
  getProperty(prop: K): T[K];
}

export interface ISetProperty<T, K extends keyof T> {
  setProperty(prop: K, value: T[K]): void;
}

export interface IChangeObject {
  getChanges(source: ISerializable): IChanges | undefined;
  setAllPropertiesChanged(): void;
}

export interface IChanges {
  id: string;
  className: string;
  log: IChange[];
}

export interface IChange {
  operation: string;
  [key: string]: any;
}

export enum ValueType {
  primitive,
  ref,
}

export type TPrimitiveType = number | string | undefined | null | boolean;

export type TPrimitiveValue = [ValueType.primitive, TPrimitiveType];

export type TRefValue = [ValueType.ref, string];

export type TSerializableValue = TPrimitiveValue | TRefValue;

export interface IBaseSerializable<T, K extends keyof T>
  extends ISerializable,
    IGetProperty<T, K>,
    ISetProperty<T, K> {}
