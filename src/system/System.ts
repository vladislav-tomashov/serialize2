import { ClassesRegistry } from "../serialize/services/ClassesRegistry";
import { ChangesRegistry } from "../serialize/services/ChangesRegistry";
import { ObjectsRegistry } from "../serialize/services/ObjectsRegistry";
import { ISystem } from "./system.interface";
import { ISerializable } from "../serialize/serialize.interface";
import { treeToArray } from "../serialize/utils/tree-utils";
import { ChangesTransferService } from "../serialize/services/ChangesTransferService";
import { ChangableArrayCollection } from "../serialize/serializable-collections/ChangableArrayCollection";
import { IChangableArrayCollection } from "../serialize/serializable-collections/changable-collections.interface";
import { StaticVariablesSync } from "./StaticVariablesSync";
import { getId } from "../serialize/utils/id-utils";

const getNodes = (node: ISerializable<any, any>) =>
  Object.values(node.getAllProperties()).filter((x) => typeof x === "object");

export class System implements ISystem {
  private _classesRegistry = new ClassesRegistry();

  private _objectsRegistry = new ObjectsRegistry();

  private _changesRegistry = new ChangesRegistry();

  private _transerService = new ChangesTransferService();

  private _staticVariablesSync = new StaticVariablesSync(
    this,
    "variables-sync"
  );

  private _root: IChangableArrayCollection<
    ISerializable<any, any>
  > = new ChangableArrayCollection<ISerializable<any, any>>(
    [this._staticVariablesSync],
    this,
    "root"
  );

  get root() {
    return this._root;
  }

  get transerService() {
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

  async transferChanges(formatJson = false): Promise<void> {
    if (this._changesRegistry.isEmpty()) {
      return;
    }

    this._staticVariablesSync.idCounter = getId();

    const changes = this._changesRegistry.getChangesAsJson();
    const numberOfSpaces = formatJson ? 4 : undefined;
    const changesAsString = JSON.stringify(changes, undefined, numberOfSpaces);

    await this._transerService.transferChanges(changesAsString);

    this._changesRegistry.clear();
    this.refreshObjectsRegistry();
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
    this._objectsRegistry.createOrUpdateObjects(changes, this);
  }
}
