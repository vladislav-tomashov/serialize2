import { IObjectsRegistry } from "./interfaces";
import {
  ISerializable,
  isSerializable,
  IChanges,
  ISerializationContext,
} from "../../serializable-object/interfaces";

export class ObjectsRegistry implements IObjectsRegistry {
  private _objectsRegistry: { [key: string]: ISerializable<any> } = {};

  add<T>(obj: ISerializable<T>): void {
    if (!isSerializable(obj)) {
      throw new Error(
        `Object does not implement interface ISerializable: ${obj}`,
      );
    }

    if (this._objectsRegistry[obj.id] !== undefined) {
      throw new Error(`Object with id "${obj.id}" is already registered`);
    }

    this._objectsRegistry[obj.id] = obj;
  }

  addMany(arr: ISerializable<any>[]): void {
    arr.forEach((obj) => this.add(obj));
  }

  get<T>(id: string): ISerializable<T> | undefined {
    return this._objectsRegistry[id];
  }

  getOrThrow<T>(id: string): ISerializable<T> {
    const result = this._objectsRegistry[id];

    if (!result) {
      throw new Error(`Cannot find object with id="${id}"`);
    }

    return result;
  }

  clear(): void {
    this._objectsRegistry = {};
  }

  updateObjects(
    changes: IChanges[],
    context: ISerializationContext,
  ): ISerializable<any>[] {
    changes.forEach((x) => this._createObject(x, context));

    return changes.map((x) => this._updateObject(x));
  }

  // private
  private _createObject<T>(
    change: IChanges,
    context: ISerializationContext,
  ): ISerializable<T> | undefined {
    const { id, className } = change;
    const obj = this.get(id);

    if (obj) {
      return undefined;
    }

    if (!className) {
      throw new Error(`Class name is required to create object with id=${id}`);
    }

    const objClass = context.findClassByName(className);
    if (objClass === undefined) {
      throw new Error();
    }

    const newObj = Object.create(objClass.prototype) as ISerializable<T>;

    newObj.init({ id, context });

    this.add(newObj);

    return newObj;
  }

  private _updateObject<T>(change: IChanges): ISerializable<T> {
    const { id } = change;
    const obj = this.getOrThrow<T>(id);

    obj.setChanges(change);

    return obj;
  }
}
