import { ISerializable } from "../serialize.interface";
import { ObjectChanges } from "../serializable-object/ObjectChanges";
import { getContext } from "../../context/context";
import { System } from "../../system/System";

export class SystemChanges {
  private _changes = new Map<ISerializable<any>, ObjectChanges<any, any>>();

  private _newObjects = new Set<ISerializable<any>>();

  setChange(obj: ISerializable<any>, change: ObjectChanges<any, any>): void {
    const { objects } = getContext() as System;

    if (!objects.hasObject(obj)) {
      change.disable();
      this._newObjects.add(obj);
    }

    this._changes.set(obj, change);
  }

  getChange(obj: ISerializable<any>): ObjectChanges<any, any> | undefined {
    return this._changes.get(obj);
  }

  deleteChange(obj: ISerializable<any>): boolean {
    this._newObjects.delete(obj);
    return this._changes.delete(obj);
  }

  clear(): void {
    this._newObjects.clear();
    this._changes.clear();
  }
}
