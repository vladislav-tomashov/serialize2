import { IChangeObject, IBaseSerializable } from "../serialize.interface";
import { IObjectChanges } from "./serializable-object.interface";
import { toSerializableValue } from "../utils/serialize-utils";

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
    if (!this._log.size) {
      return undefined;
    }

    const log = Array.from(this._log).map((prop) => {
      const value = toSerializableValue(source.getProperty(prop));
      const property = prop as string;

      return {
        operation: "update",
        property,
        value,
      };
    });

    return {
      id: source.id,
      className: source.getClassName(),
      log,
    };
  }
}
