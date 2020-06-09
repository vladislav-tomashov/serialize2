import {
  ISerializable,
  ISerializableClass,
  ISerializationContext,
} from "../serializable-object";
import { ISerializableSystem } from "./interfaces";
import {
  ClassesRegistry,
  ObjectsRegistry,
  ChangesRegistry,
  ChangesTransferService,
} from "../services";
import { treeToArray } from "../utils";
import {
  ISerializableCollection,
  BaseSerializableCollection,
} from "../serializable-collections";
import { IdGeneratorSync } from "./id-generator-sync";

const getNodes = (node: ISerializable<any>) =>
  Object.values(node.getAllProperties()).filter((x) => typeof x === "object");

export class SerializableSystem implements ISerializableSystem {
  private _classesRegistry = new ClassesRegistry();

  private _objectsRegistry = new ObjectsRegistry();

  private _changesRegistry = new ChangesRegistry();

  private _transerService = new ChangesTransferService();

  private _context: ISerializationContext = {
    setChanged: <T>(serializable: ISerializable<T>): void => {
      this._changesRegistry.add<T>(serializable);
    },

    findSerializableById: <T>(id: string): ISerializable<T> | undefined => {
      return this._objectsRegistry.get<T>(id);
    },

    findClassByName: <T>(name: string): ISerializableClass<T> | undefined => {
      return this._classesRegistry.get<T>(name);
    },
  };

  private _currentIdSync = new IdGeneratorSync(
    "current-id-sync",
    this._context
  );

  private _root: ISerializableCollection<ISerializable<any>>;

  constructor(predefinedSerializables: Array<ISerializable<any>> = []) {
    this._root = new BaseSerializableCollection<ISerializable<any>>(
      "root",
      [...predefinedSerializables, this._currentIdSync],
      this._context
    );

    this.refreshObjectsRegistry();
  }

  get context(): ISerializationContext {
    return this._context;
  }

  get root() {
    return this._root;
  }

  get transferService() {
    return this._transerService;
  }

  get changesRegistry() {
    return this._changesRegistry;
  }

  get classesRegistry() {
    return this._classesRegistry;
  }

  get objectsRegistry() {
    return this._objectsRegistry;
  }

  refreshObjectsRegistry(): void {
    const objects = treeToArray(this._root, getNodes);

    this._objectsRegistry.clear();
    this._objectsRegistry.addMany(objects);
  }

  async transferChanges(formatJson = false): Promise<boolean> {
    if (this._changesRegistry.isEmpty()) {
      return false;
    }

    this._currentIdSync.refresh();

    const changes = this._changesRegistry.getChangesAsJson();
    const numberOfSpaces = formatJson ? 4 : undefined;
    const changesAsString = JSON.stringify(changes, undefined, numberOfSpaces);

    await this._transerService.transferChanges(changesAsString);

    this._changesRegistry.clear();
    this.refreshObjectsRegistry();

    return true;
  }

  receiveChanges(transerId: number, changesAsString: string): void {
    const changes = this._transerService.receiveChanges(
      transerId,
      changesAsString
    );

    if (!Array.isArray(changes)) {
      throw new Error(
        "Error receiving changes: received data is not an Array<IChanges>."
      );
    }

    this._changesRegistry.clear();

    this._objectsRegistry.updateObjects(changes, this._context);
  }
}
