import {
  ISerializable,
  isSerializable,
  IChanges,
} from "../serialize.interface";
import { IObjectsRegistry } from "./services.interface";
import { ISystem } from "../../system/system.interface";

export class ObjectsRegistry implements IObjectsRegistry {
  private _objectsTable: { [key: string]: ISerializable<any, any> } = {};

  add(obj: ISerializable<any, any>): void {
    if (!isSerializable(obj)) {
      throw new Error(
        `Object does not implement interface ISerializable: ${obj}`
      );
    }

    if (this._objectsTable[obj.id] !== undefined) {
      throw new Error(`Object with id "${obj.id}" is already registered`);
    }

    this._objectsTable[obj.id] = obj;
  }

  addMany(arr: ISerializable<any, any>[]): void {
    arr.forEach((obj) => this.add(obj));
  }

  get(id: string): ISerializable<any, any> | undefined {
    return this._objectsTable[id];
  }

  getOrThrow(id: string): ISerializable<any, any> {
    const result = this._objectsTable[id];

    if (!result) {
      throw new Error(`Cannot find object with id=${id}`);
    }

    return result;
  }

  clear(): void {
    this._objectsTable = {};
  }

  createOrUpdateObjects(
    changes: IChanges[],
    context: ISystem
  ): ISerializable<any, any>[] {
    changes.forEach((x) => this._createObject(x, context));

    return changes.map((x) => this._updateObject(x));
  }

  //private
  private _createObject(
    change: IChanges,
    context: ISystem
  ): ISerializable<any, any> | undefined {
    const { id, className } = change;
    const obj = this.get(id);

    if (obj) {
      return undefined;
    }

    const { classesRegistry } = context;

    if (!className) {
      throw new Error(`Class name is required to create object with id=${id}`);
    }

    const objClass = classesRegistry.getOrThrow(className);
    const newObj = Object.create(objClass.prototype) as ISerializable<any, any>;

    newObj.initialize({ id, context });

    this.add(newObj);

    return newObj;
  }

  private _updateObject(change: IChanges): ISerializable<any, any> {
    const { id } = change;
    const obj = this.getOrThrow(id);

    obj.applyChanges(change);

    return obj;
  }
}
