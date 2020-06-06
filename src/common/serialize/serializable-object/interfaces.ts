export type TSerializablePrimitive =
  | number
  | string
  | undefined
  | null
  | boolean;

export type TSerializableReference = [string];

export type TSerializableValue =
  | TSerializablePrimitive
  | TSerializableReference;

export type TPropertyChange = [string, TSerializableValue];

export interface IChange {
  op?: number;

  [key: string]: any;
}

export interface IChanges {
  id: string;

  className?: string;

  log: Array<IChange>;
}

export interface IObjectChange extends IChange {
  d: TPropertyChange;
}

export interface IObjectChanges extends IChanges {
  log: Array<IObjectChange>;
}

export interface IGetProperty<T> {
  getProperty(prop: keyof T): T[keyof T];

  getAllProperties(): T;
}

export interface ISetProperty<T> {
  setProperty(prop: keyof T, value: T[keyof T]): void;
}

export interface IChangeObject<T> {
  getChanges(source: ISerializable<T>): IChanges;

  setAllPropertiesChanged(): void;

  clear(): void;
}

export interface ISerializableClass<T> {
  name: string;

  prototype: ISerializable<T>;
}

export interface IFindSerializableClass {
  findClassByName<T>(name: string): ISerializableClass<T> | undefined;
}

export interface IFindSerializable {
  findSerializableById<T>(id: string): ISerializable<T> | undefined;
}

export interface ISerializationContext
  extends IFindSerializable,
    IFindSerializableClass {
  setChanged<T>(serializable: ISerializable<T>): void;
}

export interface ISerializableInitParams {
  id: string;

  context: ISerializationContext;
}

export interface ISerializable<TState> extends IGetProperty<TState> {
  readonly serializable: true;

  readonly id: string;

  getClassName(): string;

  setChanges(changes: IChanges): void;

  getChanges(): IChanges;

  clearChanges(): void;

  init(params: ISerializableInitParams): void;
}

export function isSerializable<T>(value: any): value is ISerializable<T> {
  return typeof value === "object" && value.serializable;
}
