import {
  ISerializable,
  isSerializable,
  IChanges,
} from "../serialize.interface";
import {
  ISerializableObjects,
  ISerializableClasses,
} from "./services.interface";

export class SerializableObjects implements ISerializableObjects {
  private _objects: { [key: string]: ISerializable } = {};

  addObject(obj: ISerializable): void {
    if (!isSerializable(obj)) {
      throw new Error(
        `Object does not implement interface ISerializable: ${obj}`
      );
    }

    if (this._objects[obj.id] !== undefined) {
      throw new Error(`Object with id "${obj.id}" is already registered`);
    }

    this._objects[obj.id] = obj;
  }

  deleteObject(id: string): void;
  deleteObject(obj: ISerializable): void;
  deleteObject(idOrObj: any): void {
    if (typeof idOrObj === "string") {
      const id = idOrObj;
      delete this._objects[id];

      return;
    }

    const obj = idOrObj;

    if (!isSerializable(obj)) {
      throw new Error(
        `Object does not implement interface ISerializable: ${obj}`
      );
    }

    delete this._objects[obj.id];
  }

  addCollection(arr: ISerializable[]): void {
    arr.forEach((obj) => this.addObject(obj));
  }

  getObject(id: string): ISerializable | undefined {
    return this._objects[id];
  }

  getObjectOrThrow(id: string): ISerializable {
    const result = this._objects[id];

    if (!result) {
      throw new Error(`Cannot find object with id=${id}`);
    }

    return result;
  }

  hasObject(id: string): boolean;
  hasObject(obj: ISerializable): boolean;
  hasObject(idOrObj: any): boolean {
    if (typeof idOrObj === "string") {
      const id = idOrObj;

      return !!this._objects[id];
    }

    const obj = idOrObj;

    if (!isSerializable(obj)) {
      return false;
    }

    return !!this._objects[obj.id];
  }

  clear(): void {
    this._objects = {};
  }

  createOrUpdateObjects(
    changes: IChanges[],
    classes: ISerializableClasses
  ): ISerializable[] {
    changes.forEach((x) => this._createObject(x, classes));

    return changes.map((x) => this._updateObject(x));
  }

  //private
  private _createObject(
    change: IChanges,
    classes: ISerializableClasses
  ): ISerializable | undefined {
    const { id, className } = change;
    const obj = this.getObject(id);

    if (obj) {
      return undefined;
    }

    const objClass = classes.getClassOrThrow(className);
    const newObj = Object.create(objClass.prototype);

    newObj.serializable = true;
    newObj._id = id;

    this.addObject(newObj);

    return newObj;
  }

  private _updateObject(change: IChanges): ISerializable {
    const { id } = change;
    const obj = this.getObjectOrThrow(id);

    obj.applyChanges(change);

    return obj;
  }
}
