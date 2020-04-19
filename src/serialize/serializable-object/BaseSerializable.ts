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
import { ISystemChanges } from "../services/services.interface";

export class BaseSerializable<T extends IBaseState, K extends keyof T>
  implements IBaseSerializable<T, K> {
  private _id = getId();

  protected _state = {} as T;

  constructor() {
    const changeObj = this._createChangesObject();
    changeObj.setAllPropertiesChanged();
  }

  // Interface ISerializable
  serializable: true = true;

  get id(): string {
    return this._id;
  }

  applyChanges(changes: IObjectChanges): void {
    // if (changes.className !== this.getClassName()) {
    //   throw new Error(
    //     `Cannot applyChanges, because changes have different className: "${changes.className}" !== "this.getClassName()"`
    //   );
    // }

    if (!this._state) {
      this._state = {} as T;
    }

    changes.log.forEach((change) => {
      const { operation, value, property } = change;

      if (operation && operation !== ObjectChangeType.PropertyChange) {
        throw new Error(`Uknown operation "${operation}"`);
      }

      const newValue = (fromSerializedValue(value) as unknown) as T[K];
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

  protected _createChangesObject(
    changes: ISystemChanges = getContext().changes
  ): ObjectChanges<T, K> {
    const result = new ObjectChanges<T, K>();

    changes.setChangeObject(this, result);

    return result;
  }

  protected _getChangeObject(
    changes: ISystemChanges = getContext().changes
  ): ObjectChanges<T, K> {
    const result = changes.getChangeObject(this) as ObjectChanges<T, K>;

    return result ? result : this._createChangesObject(changes);
  }
}
