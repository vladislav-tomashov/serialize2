import { getId } from "../utils/id-utils";
import { getContext } from "../../context/context";
import { ObjectChanges } from "./ObjectChanges";
import {
  IBaseState,
  IObjectChanges,
  IBaseSerializable,
  ObjectChangeType,
} from "./serializable-object.interface";
import { fromSerializedValue } from "../utils/serialize-utils";

export class BaseSerializable<T extends IBaseState, K extends keyof T>
  implements IBaseSerializable<T, K> {
  private _id = getId();

  protected _state = {} as T;

  constructor(private _context = getContext()) {
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

  applyChanges(changes: IObjectChanges): void {
    const { objects } = this._context;

    if (!this._state) {
      this._state = {} as T;
    }

    changes.log.forEach((change) => {
      const { operation, value, property } = change;

      if (operation && operation !== ObjectChangeType.PropertyChange) {
        throw new Error(`Uknown operation "${operation}"`);
      }

      const newValue = (fromSerializedValue(value, objects) as unknown) as T[K];
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
    const { changes } = this._context;
    const result = new ObjectChanges<T, K>();

    changes.setChangeObject(this, result);

    return result;
  }

  protected _getChangeObject(): ObjectChanges<T, K> {
    const { changes } = this._context;
    const result = changes.getChangeObject(this) as ObjectChanges<T, K>;

    return result ? result : this._createChangesObject();
  }
}
