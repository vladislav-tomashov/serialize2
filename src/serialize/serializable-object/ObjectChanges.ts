import { IChangeObject, ISerializable } from "../serialize.interface";
import {
  IObjectChanges,
  TPropertyChange,
} from "./serializable-object.interface";
import { toSerializedValue } from "../utils/serialize-utils";

export class ObjectChanges<T, K extends keyof T>
  implements IChangeObject<T, K> {
  private _log = new Set<K>();

  private _allPropertiesChanged = false;

  setAllPropertiesChanged(): void {
    this._allPropertiesChanged = true;
  }

  setPropertyChanged(prop: K, value: T[K]) {
    if (this._allPropertiesChanged) {
      return;
    }

    this._log.add(prop);
  }

  getChanges(source: ISerializable<T, K>): IObjectChanges | undefined {
    const id = source.id;
    const className = source.getClassName();

    if (this._allPropertiesChanged) {
      const log = Object.entries(source.getAllProperties()).map(
        ([prop, val]) => ({
          d: [prop, toSerializedValue(val)] as TPropertyChange,
        })
      );

      if (!log.length) {
        return undefined;
      }

      return { id, className, log };
    }

    if (!this._log.size) {
      return undefined;
    }

    const log = Array.from(this._log).map((prop) => ({
      d: [prop, toSerializedValue(source.getProperty(prop))] as TPropertyChange,
    }));

    if (!log.length) {
      return undefined;
    }

    return { id, log };
  }
}
