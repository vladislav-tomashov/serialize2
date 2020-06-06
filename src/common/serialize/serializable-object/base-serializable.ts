import {
  ISerializable,
  IObjectChanges,
  ISerializableInitParams,
  ISerializationContext,
} from "./interfaces";
import { ObjectChanges } from "./object-changes";
import { fromSerializedValue } from "../utils";
import { ObjectChangeType } from "./object-change-type";
import { registerSerializableClass } from "../services";

class BaseSerializable<TState> implements ISerializable<TState> {
  private _state = {} as TState;

  private _changes?: ObjectChanges<TState>;

  private _changed = true;

  constructor(
    private _id: string,
    private _serializationContext?: ISerializationContext,
  ) {
    if (_serializationContext) {
      _serializationContext.setChanged(this);

      this._changes = new ObjectChanges<TState>();
    }
  }

  // Interface ISerializable
  // eslint-disable-next-line class-methods-use-this
  get serializable(): true {
    return true;
  }

  get id(): string {
    return this._id;
  }

  init({ id, context }: ISerializableInitParams): void {
    if (this._state) {
      throw new Error("Object is already initialized");
    }

    this._state = {} as TState;
    this._id = id;
    this._serializationContext = context;
  }

  getChanges(): IObjectChanges {
    this._throwIfChangesWereNotCreated();

    return this._changes.getChanges(this);
  }

  clearChanges(): void {
    this._throwIfChangesWereNotCreated();

    if (!this._changed) {
      return;
    }

    this._changed = false;
    this._changes.clear();
  }

  setChanges(changes: IObjectChanges): void {
    this._throwIfChangesWereNotCreated();

    changes.log.forEach((change) => {
      const { op, d } = change;

      if (op && op !== ObjectChangeType.PropertyChange) {
        throw new Error(`Unknown operation="${op}"`);
      }

      const [prop, value] = d;
      const newValue = (fromSerializedValue(
        value,
        this._serializationContext,
      ) as unknown) as TState[keyof TState];

      this._state[prop as keyof TState] = newValue;
    });
  }

  getClassName(): string {
    return this.constructor.name;
  }

  // Interface IGetProperty
  getProperty(prop: keyof TState): TState[keyof TState] {
    return this._state[prop];
  }

  getAllProperties(): TState {
    return this._state;
  }

  // protected and private
  protected _setProperty(
    prop: keyof TState,
    value: TState[keyof TState],
  ): void {
    if (this._state[prop] === value) {
      return;
    }

    this._state[prop] = value;

    if (!this._changes) {
      return;
    }

    this._changes.setPropertyChanged(prop, value);

    this._setChanged();
  }

  private _setChanged() {
    if (!this._changed) {
      this._serializationContext.setChanged(this);
    }
  }

  private _throwIfChangesWereNotCreated() {
    if (!this._changes) {
      throw new Error(`Changes were not created`);
    }
  }
}

registerSerializableClass(BaseSerializable);

export { BaseSerializable };
