import { getId } from "../../utils/id-utils";
import {
  ISerializableState,
  ISerializable,
  IGetProperty,
  ISetProperty,
} from "../serialize.interface";
import { getContext } from "../../context/context";
import { ObjectChanges } from "./ObjectChanges";
import { System } from "../../system/System";

export class BaseSerializable<T extends ISerializableState, K extends keyof T>
  implements ISerializable<T>, IGetProperty<T, K>, ISetProperty<T, K> {
  private _id = getId();

  protected _state: T = {
    className: this.getClassName(),
  } as T;

  // Interface ISerializable
  serializable: true = true;

  get id(): string {
    return this._id;
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
    this._setPropertyChanged(prop, value);
  }

  // protected and private
  protected _setPropertyChanged(prop: K, value: T[K]): void {
    const { changes } = getContext() as System;
    let change = changes.getChange(this);

    if (!change) {
      change = new ObjectChanges<T, K>();
      changes.setChange(this, change);
    }

    change.setPropertyChanged(prop, value);
  }
}
