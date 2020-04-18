import { getId } from "../utils/id-utils";
import { IBaseSerializable } from "../serialize.interface";
import { getContext } from "../../context/context";
import { ObjectChanges } from "./ObjectChanges";
import { System } from "../../system/System";
import { IBaseState, IObjectChanges } from "./serializable-object.interface";
import { fromSerializableValue } from "../utils/serialize-utils";

export class BaseSerializable<T extends IBaseState, K extends keyof T>
  implements IBaseSerializable<T, K> {
  private _id = getId();

  protected _state: T = {} as T;

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

      const newValue = (fromSerializableValue(value) as unknown) as T[K];
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

  // Interface ISetProperty
  setProperty(prop: K, value: T[K]): void {
    this._state[prop] = value;
    this._getChangeObject().setPropertyChanged(prop, value);
  }

  // protected and private
  protected _getChangeObject(): ObjectChanges<T, K> {
    const { changes } = getContext() as System;
    const result = changes.getChangeObject(this) as ObjectChanges<T, K>;

    if (result) {
      return result;
    }

    const newChanges = new ObjectChanges<T, K>();
    changes.setChangeObject(this, newChanges);

    return newChanges;
  }
}
