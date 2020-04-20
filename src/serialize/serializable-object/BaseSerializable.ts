import { getId } from "../utils/id-utils";
import { getContext } from "../../context/context";
import { ObjectChanges } from "./ObjectChanges";
import {
  IBaseState,
  IObjectChanges,
  ObjectChangeType,
} from "./serializable-object.interface";
import { fromSerializedValue } from "../utils/serialize-utils";
import { ISerializable } from "../serialize.interface";
import { ISystem } from "../../system/system.interface";
import { registerClass } from "../services/ClassesRegistry";

class BaseSerializable<T extends IBaseState, K extends keyof T>
  implements ISerializable<T, K> {
  protected _state: T;

  constructor(private _id = getId(), private _context = getContext()) {
    this._state = {} as T;

    const changeObj = this._createChangesObject();
    changeObj.setAllPropertiesChanged();
  }

  // Interface ISerializable
  get serializable(): true {
    return true;
  }

  get id(): string {
    return this._id;
  }

  initialize({ id, context }: { id: string; context: ISystem }): void {
    if (this._state) {
      throw new Error("initialize() can be called only once");
    }

    this._state = {} as T;
    this._id = id;
    this._context = context;
  }

  applyChanges(changes: IObjectChanges): void {
    const { objectsRegistry } = this._context;

    changes.log.forEach((change) => {
      const { op, d } = change;

      if (op && op !== ObjectChangeType.PropertyChange) {
        throw new Error(`Uknown op="${op}"`);
      }

      const [property, value] = d;
      const newValue = (fromSerializedValue(
        value,
        objectsRegistry
      ) as unknown) as T[K];

      this._state[property as K] = newValue;
    });
  }

  getClassName(): string {
    return this.constructor.name;
  }

  // Interface IGetProperty
  getProperty(prop: K): T[K] {
    return this._state[prop];
  }

  getAllProperties(): T {
    return this._state;
  }

  // protected and private
  protected _setProperty(prop: K, value: T[K]): void {
    this._state[prop] = value;
    this._getChangeObject().setPropertyChanged(prop, value);
  }

  protected _createChangesObject(): ObjectChanges<T, K> {
    const { changesRegistry } = this._context;
    const result = new ObjectChanges<T, K>();

    changesRegistry.set(this, result);

    return result;
  }

  protected _getChangeObject(): ObjectChanges<T, K> {
    const { changesRegistry } = this._context;
    const result = changesRegistry.get(this) as ObjectChanges<T, K>;

    return result ? result : this._createChangesObject();
  }
}

registerClass("BaseSerializable", BaseSerializable);

export { BaseSerializable };
