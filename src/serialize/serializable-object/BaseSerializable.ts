import { getId } from "../utils/id-utils";
import { getContext } from "../../context/context";
import { ObjectChanges } from "./ObjectChanges";
import {
  IBaseState,
  IObjectChanges,
  IBaseSerializable,
} from "./serializable-object.interface";
import { fromSerializedValue } from "../utils/serialize-utils";

export class BaseSerializable<T extends IBaseState, K extends keyof T>
  implements IBaseSerializable<T, K> {
  private _id = getId();

  protected _state: T = {} as T;

  constructor() {
    const { changes } = getContext();
    const changeObj = new ObjectChanges<T, K>();

    changeObj.setAllPropertiesChanged();
    changes.setChangeObject(this, changeObj);
  }

  // Interface ISerializable
  serializable: true = true;

  get id(): string {
    return this._id;
  }

  applyChanges(changes: IObjectChanges): void {
    if (changes.className !== this.getClassName()) {
      throw new Error(
        `Cannot applyChanges, because changes have different className: "${changes.className}" !== "this.getClassName()"`
      );
    }

    this._id = changes.id;

    changes.log.forEach((change) => {
      const { operation, value, property } = change;

      if (operation !== "update") {
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

  protected _getChangeObject(): ObjectChanges<T, K> {
    const { changes } = getContext();
    const existingChageObj = changes.getChangeObject(this) as ObjectChanges<
      T,
      K
    >;

    if (existingChageObj) {
      return existingChageObj;
    }

    const newChangeObj = new ObjectChanges<T, K>();
    changes.setChangeObject(this, newChangeObj);

    return newChangeObj;
  }
}
