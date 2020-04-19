import { IChangeObject } from "../serialize.interface";
import {
  IObjectChanges,
  IBaseSerializable,
} from "./serializable-object.interface";
import { toSerializedValue } from "../utils/serialize-utils";

export class ObjectChanges<T, K extends keyof T> implements IChangeObject {
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

  getChanges(source: IBaseSerializable<T, K>): IObjectChanges | undefined {
    const id = source.id;
    const className = source.getClassName();

    if (this._allPropertiesChanged) {
      const log = Object.entries(source.getAllProperties()).map(
        ([prop, val]) => ({
          // operation: ObjectChangeType.PropertyChange,
          property: prop as string,
          value: toSerializedValue(val),
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
      // operation: ObjectChangeType.PropertyChange,
      property: prop as string,
      value: toSerializedValue(source.getProperty(prop)),
    }));

    if (!log.length) {
      return undefined;
    }

    return { id, className, log };
  }
}
