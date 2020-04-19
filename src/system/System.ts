import { SerializableClasses } from "../serialize/services/SerializableClasses";
import { SystemChanges } from "../serialize/services/SystemChanges";
import { SerializableObjects } from "../serialize/services/SerializableObjects";
import { ISystem } from "./system.interface";
import {
  ISerializableExtended,
  IGetProperty,
} from "../serialize/serialize.interface";
import { treeToArray } from "../serialize/utils/tree-utils";
import { SystemChangesTransferService } from "../serialize/services/SystemChangesTransferService";

const getNodes = (node: IGetProperty<any, any>) =>
  Object.values(node.getAllProperties()).filter((x) => typeof x === "object");

export class System implements ISystem {
  private _classes = new SerializableClasses();

  private _objects = new SerializableObjects();

  private _changes = new SystemChanges();

  private _transerService = new SystemChangesTransferService();

  private _root: ISerializableExtended<any, any> | undefined;

  get transerService() {
    return this._transerService;
  }

  get changes() {
    return this._changes;
  }

  get classes() {
    return this._classes;
  }

  get objects() {
    return this._objects;
  }

  getRoot() {
    return this._root;
  }

  setRoot(value: ISerializableExtended<any, any>) {
    this._root = value;
  }

  updateObjectsTable(): void {
    if (!this._root) {
      throw new Error("There is no root in the system. Call setRoot() first.");
    }

    const objects = treeToArray(this._root, getNodes);

    this._changes.clear();
    this._objects.clear();
    this._objects.addCollection(objects);
  }

  async transferChanges(formatJson = false): Promise<void> {
    const changes = this._changes.getChangesAsJson();
    const numberOfSpaces = formatJson ? 4 : undefined;
    const changesAsString = JSON.stringify(changes, undefined, numberOfSpaces);

    await this._transerService.transferChanges(changesAsString);
    this.updateObjectsTable();
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

    this._changes.clear();
    this._objects.createOrUpdateObjects(changes, this._classes);
  }
}
