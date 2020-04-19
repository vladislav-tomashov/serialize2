import {
  ISerializableClasses,
  ISerializableObjects,
  ISystemChanges,
} from "../serialize/services/services.interface";
import { ISerializableExtended } from "../serialize/serialize.interface";
import { SystemChangesTransferService } from "../serialize/services/SystemChangesTransferService";
import { IChangableArrayCollection } from "../serialize/serializable-collections/changable-collections.interface";

export interface ISystem {
  readonly classes: ISerializableClasses;

  readonly objects: ISerializableObjects;

  readonly changes: ISystemChanges;

  readonly transerService: SystemChangesTransferService;

  readonly root: IChangableArrayCollection<ISerializableExtended<any, any>>;

  updateObjectsTable(): void;

  transferChanges(formatJson: boolean): Promise<void>;

  receiveChanges(transerId: number, changesAsString: string): void;
}
