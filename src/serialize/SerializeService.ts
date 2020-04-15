import {
  ISerializableClass,
  ISerializable,
  isSerializable,
} from "./serialize.interface";

export class SerializeService {
  private _classes: { [key: string]: ISerializableClass } = {};
  private _objects: { [key: string]: ISerializable } = {};

  registerSerializableClass(className: string, fun: ISerializableClass) {
    if (this._classes[className] !== undefined) {
      throw new Error(
        `SerializeService.registerSerializableClass(): Class with name "${className}" is already registered`
      );
    }

    this._classes[className] = fun;
  }

  registerSerializableObject(obj: ISerializable) {
    if (!isSerializable(obj)) {
      throw new Error(
        `Object does not implement interface ISerializable: ${obj}`
      );
    }

    if (this._objects[obj.id] !== undefined) {
      throw new Error(
        `SerializeService.registerSerializableObject(): Object with id "${obj.id}" is already registered`
      );
    }

    this._objects[obj.id] = obj;
  }

  registerSerializableObjectsCollection(arr: ISerializable[]) {
    arr.forEach((obj) => this.registerSerializableObject(obj));
  }
}
