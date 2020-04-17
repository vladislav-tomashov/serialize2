import { ISerializable, IChangeObject } from "../serialize.interface";
import { getContext } from "../../context/context";
import { System } from "../../system/System";

export class SystemChanges {
  private _changes = new Map<ISerializable<any, any>, IChangeObject>();

  private _newObjects = new Set<ISerializable<any, any>>();

  setChangeObject(obj: ISerializable<any, any>, change: IChangeObject): void {
    const { objects } = getContext() as System;

    if (!objects.hasObject(obj)) {
      change.disable();
      this._newObjects.add(obj);
    }

    this._changes.set(obj, change);
  }

  getChangeObject(obj: ISerializable<any, any>): IChangeObject | undefined {
    return this._changes.get(obj);
  }

  deleteChangeObject(obj: ISerializable<any, any>): boolean {
    this._newObjects.delete(obj);
    return this._changes.delete(obj);
  }

  clear(): void {
    this._newObjects.clear();
    this._changes.clear();
  }
}
