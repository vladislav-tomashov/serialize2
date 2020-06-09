import { ISerializable, ISerializationContext } from "../serializable-object";
import {
  IClassesRegistry,
  IObjectsRegistry,
  IChangesRegistry,
  IChangesTransferService,
} from "../services";
import { ISerializableCollection } from "../serializable-collections";

export interface ISerializableSystem {
  readonly classesRegistry: IClassesRegistry;

  readonly objectsRegistry: IObjectsRegistry;

  readonly changesRegistry: IChangesRegistry;

  readonly transferService: IChangesTransferService;

  readonly root: ISerializableCollection<ISerializable<any>>;

  readonly context: ISerializationContext;

  refreshObjectsRegistry(): void;

  transferChanges(formatJson: boolean): Promise<boolean>;

  receiveChanges(transerId: number, changesAsString: string): void;
}
