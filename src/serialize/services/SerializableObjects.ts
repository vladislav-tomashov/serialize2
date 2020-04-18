import { ISerializable, isSerializable } from "../serialize.interface";

export class SerializableObjects {
  private _objects: { [key: string]: ISerializable } = {};

  addObject(obj: ISerializable): void {
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

  clear() {
    this._objects = {};
  }
}
