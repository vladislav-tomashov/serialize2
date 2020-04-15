import { getId } from "../utils/id-utils";
import {
  ISerializableState,
  ISerializable,
  IGetProperty,
  ISetProperty,
} from "./serialize.interface";

export class SerializableBase<T extends ISerializableState, K extends keyof T>
  implements ISerializable, IGetProperty<T, K>, ISetProperty<T, K> {
  private _id = getId();

  protected _state: T = {
    className: this.getClassName(),
    id: this.id,
  } as T;

  // Interface ISerializable
  serializable: true = true;

  get id(): string {
    return this._id;
  }

  getState(): ISerializableState {
    return this._state;
  }

  setState(state: ISerializableState) {}

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
  }
}
