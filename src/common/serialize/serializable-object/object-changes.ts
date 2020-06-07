import {
  IChangeObject,
  IObjectChanges,
  ISerializable,
  TPropertyChange,
} from "./interfaces";
import { toSerializedValue } from "../utils";

export class ObjectChanges<TState> implements IChangeObject<TState> {
  private _log: { [key: string]: true } = {};

  constructor(private _allPropertiesChanged = true) {}

  clear(): void {
    this._log = {};
    this._resetAllPropertiesChanged();
  }

  setAllPropertiesChanged(): void {
    if (!this._allPropertiesChanged) {
      this._allPropertiesChanged = true;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setPropertyChanged(prop: keyof TState, value: TState[keyof TState]) {
    if (this._allPropertiesChanged) {
      return;
    }

    this._log[String(prop)] = true;
  }

  getChanges(source: ISerializable<TState>): IObjectChanges {
    const { id } = source;
    const className = source.getClassName();

    if (this._allPropertiesChanged) {
      const log = Object.entries(source.getAllProperties()).map(
        ([prop, val]) => ({
          d: [prop, toSerializedValue(val)] as TPropertyChange,
        })
      );

      return { id, className, log };
    }

    const log = Object.keys(this._log).map((prop) => ({
      d: [
        prop,
        toSerializedValue(source.getProperty(prop as keyof TState)),
      ] as TPropertyChange,
    }));

    return { id, log };
  }

  // private
  private _resetAllPropertiesChanged(): void {
    if (this._allPropertiesChanged) {
      this._allPropertiesChanged = false;
    }
  }
}
