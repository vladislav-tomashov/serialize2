import { ISerializable, IChangeObject } from "../serialize.interface";
import { getContext } from "../../context/context";
import { System } from "../../system/System";

export class SystemChanges {
  private _changes = new Map<ISerializable, IChangeObject>();

  setChangeObject(key: ISerializable, changeObject: IChangeObject): void {
    const { objects } = getContext() as System;

    if (!objects.hasObject(key)) {
      changeObject.setAllPropertiesChanged();
    }

    this._changes.set(key, changeObject);
  }

  getChangeObject(key: ISerializable): IChangeObject | undefined {
    return this._changes.get(key);
  }

  clear(): void {
    this._changes.clear();
  }
}
