import {
  ISerializableClass,
  ISerializable,
  IChangeObject,
  IChanges,
} from "../serialize.interface";
import { ISystem } from "../../system/system.interface";

export interface IClassesRegistry {
  add(className: string, classObject: ISerializableClass<any, any>): void;

  get(className: string): ISerializableClass<any, any> | undefined;

  has(className: string): boolean;

  getOrThrow(className: string): ISerializableClass<any, any>;

  clear(): void;
}

export interface IObjectsRegistry {
  add(obj: ISerializable<any, any>): void;

  addMany(arr: ISerializable<any, any>[]): void;

  get(id: string): ISerializable<any, any> | undefined;

  getOrThrow(id: string): ISerializable<any, any>;

  clear(): void;

  createOrUpdateObjects(
    changes: IChanges[],
    context: ISystem
  ): ISerializable<any, any>[];
}

export interface IChangesRegistry {
  set(
    key: ISerializable<any, any>,
    changeObject: IChangeObject<any, any>
  ): void;

  get(key: ISerializable<any, any>): IChangeObject<any, any> | undefined;

  isEmpty(): boolean;

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

export interface IChangesTransferService {
  readonly status: TranserStatus;

  readonly result: ITransferResult;

  transferChanges(changesAsString: string): Promise<void>;

  receiveChanges(transferId: number, changesAsString: string): any;
}
