import {
  ISerializableClass,
  ISerializable,
  IChangeObject,
  IChanges,
} from "../serialize.interface";
import { ISystem } from "../../system/system.interface";

export interface ISerializableClasses {
  addClass(className: string, classObject: ISerializableClass): void;

  getClass(className: string): ISerializableClass | undefined;
  getClassOrThrow(className: string): ISerializableClass;

  deleteClass(className: string): void;

  clear(): void;
}

export interface ISerializableObjects {
  addObject(obj: ISerializable): void;

  deleteObject(id: string): void;
  deleteObject(obj: ISerializable): void;

  addCollection(arr: ISerializable[]): void;

  getObject(id: string): ISerializable | undefined;
  getObjectOrThrow(id: string): ISerializable;

  hasObject(id: string): boolean;
  hasObject(obj: ISerializable): boolean;

  clear(): void;

  createOrUpdateObjects(changes: IChanges[], context: ISystem): ISerializable[];
}

export interface ISystemChanges {
  setChangeObject(key: ISerializable, changeObject: IChangeObject): void;

  getChangeObject(key: ISerializable): IChangeObject | undefined;

  getChangesAsJson(): IChanges[];

  clear(): void;
}

export enum TranserStatus {
  Initial,
  Sent,
  Received,
  Sending,
  Receiving,
}

export enum TranserResultStatus {
  Success,
  Error,
  Pending,
}

export interface ITransferResult {
  status: TranserResultStatus;
  error?: any;
  id: number;
  changesAsString: string;
  startTimestamp: string;
  endTimestamp?: string;
}

export interface ISystemChangesTransferService {
  readonly status: TranserStatus;
  readonly result: ITransferResult;
  transferChanges(changesAsString: string): Promise<void>;
  receiveChanges(transferId: number, changesAsString: string): any;
}
