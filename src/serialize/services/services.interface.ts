import {
  ISerializableClass,
  ISerializable,
  IChangeObject,
  IChanges,
} from "../serialize.interface";

export interface ISerializableClasses {
  addClass(className: string, classObject: ISerializableClass): void;

  deleteClass(className: string): void;

  clear(): void;
}

export interface ISerializableObjects {
  addObject(obj: ISerializable): void;

  deleteObject(id: string): void;
  deleteObject(obj: ISerializable): void;

  addCollection(arr: ISerializable[]): void;

  getObject(id: string): ISerializable | undefined;

  hasObject(id: string): boolean;
  hasObject(obj: ISerializable): boolean;

  clear(): void;
}

export interface ISystemChanges {
  setChangeObject(key: ISerializable, changeObject: IChangeObject): void;

  getChangeObject(key: ISerializable): IChangeObject | undefined;

  getChanges(): IChanges[];

  clear(): void;
}
