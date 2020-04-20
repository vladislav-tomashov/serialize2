import {
  IClassesRegistry,
  IObjectsRegistry,
  IChangesRegistry,
} from "../serialize/services/services.interface";
import { ChangesTransferService } from "../serialize/services/ChangesTransferService";
import { IChangableArrayCollection } from "../serialize/serializable-collections/changable-collections.interface";
import { ISerializable } from "../serialize/serialize.interface";

export interface ISystem {
  readonly classesRegistry: IClassesRegistry;

  readonly objectsRegistry: IObjectsRegistry;

  readonly changesRegistry: IChangesRegistry;

  readonly transerService: ChangesTransferService;

  readonly root: IChangableArrayCollection<ISerializable<any, any>>;

  refreshObjectsRegistry(): void;

  transferChanges(formatJson: boolean): Promise<void>;

  receiveChanges(transerId: number, changesAsString: string): void;
}
