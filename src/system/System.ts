import { SerializableClasses } from "../serialize/services/SerializableClasses";
import { SystemChanges } from "../serialize/services/SystemChanges";
import { SerializableObjects } from "../serialize/services/SerializableObjects";
import { ISystem } from "./system.interface";

export class System implements ISystem {
  private _classes = new SerializableClasses();
  private _objects = new SerializableObjects();
  private _changes = new SystemChanges();

  get changes() {
    return this._changes;
  }

  get classes() {
    return this._classes;
  }

  get objects() {
    return this._objects;
  }
}
