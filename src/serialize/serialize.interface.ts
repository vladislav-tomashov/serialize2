import { ISystem } from "../system/system.interface";

export interface IGetProperty<T, K extends keyof T> {
  getProperty(prop: K): T[K];
  getAllProperties(): T;
}

export interface ISetProperty<T, K extends keyof T> {
  setProperty(prop: K, value: T[K]): void;
}
export interface IInitializeParams {
  id: string;
  context: ISystem;
}
export interface ISerializable<T, K extends keyof T>
  extends IGetProperty<T, K> {
  serializable: true;
  readonly id: string;
  getClassName: () => string;
  applyChanges(changes: IChanges): void;
  initialize(params: IInitializeParams): void;
}

export function isSerializable<T, K extends keyof T>(
  value: any
): value is ISerializable<T, K> {
  return typeof value === "object" && value.serializable;
}

export interface ISerializableClass<T, K extends keyof T> {
  prototype: ISerializable<T, K>;
}

export interface IChangeObject<T, K extends keyof T> {
  getChanges(source: ISerializable<T, K>): IChanges;
  setAllPropertiesChanged(): void;
}

export interface IChanges {
  id: string;
  className?: string;
  log: IChange[];
}

export interface IChange {
  op?: number;
  [key: string]: any;
}

export type TPrimitiveType = number | string | undefined | null | boolean;

export type TPrimitiveValue = TPrimitiveType;

export type TRefValue = [string];

export type TSerializableValue = TPrimitiveValue | TRefValue;
