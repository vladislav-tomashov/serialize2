import { getId } from "../../utils/id-utils";
import {
  ISerializableState,
  ISerializable,
  IGetProperty,
  ISetProperty,
  TKeyValuePair,
} from "../serialize.interface";
import { getContext } from "../../context/context";
import { ObjectChanges } from "./ObjectChanges";
import { System } from "../../system/System";

export class BaseSerializable<T extends ISerializableState, K extends keyof T>
  implements ISerializable<T, K>, IGetProperty<T, K>, ISetProperty<T, K> {
  private _id = getId();

  protected _state: T = {
    className: this.getClassName(),
  } as T;

  // Interface ISerializable
  serializable: true = true;

  get id(): string {
    return this._id;
  }

  applyChanges(changes: TKeyValuePair<T, K>[]) {
    changes.forEach(([key, value]) => {
      this._state[key] = value;
    });
  }

  getState(): T {
    return this._state;
  }

  setState(state: T): void {
    if (this._state.className !== state.className) {
      throw new Error(
        `BaseSerializable.setState(): incoming state className="${state.className}" differs from current className="${this._state.className}"`
      );
    }

    this._state = state;
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
