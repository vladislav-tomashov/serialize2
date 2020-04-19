import {
  ISerializableClasses,
  ISerializableObjects,
  ISystemChanges,
} from "../serialize/services/services.interface";
import { ISerializableExtended } from "../serialize/serialize.interface";
import { SystemChangesTransferService } from "../serialize/services/SystemChangesTransferService";

export interface ISystem {
  readonly classes: ISerializableClasses;

  readonly objects: ISerializableObjects;

  readonly changes: ISystemChanges;

  readonly transerService: SystemChangesTransferService;

  setRoot(root: ISerializableExtended<any, any>): void;

  getRoot(): ISerializableExtended<any, any> | undefined;

  updateObjectsTable(): void;

  transferChanges(formatJson: boolean): Promise<void>;

  receiveChanges(transerId: number, changesAsString: string): void;
}
