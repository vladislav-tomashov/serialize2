import { IToJSON } from "./serializable-object.interface";
import { ObjectChanges } from "./ObjectChanges";
import {
  IChangable,
  TChanges,
  toChangable,
  INestedChanges,
  IOwnChanges,
  TNestedChanges,
  TObjectChange,
} from "../serialize.interface";
import { SimpleObjectState } from "../BaseState";

export class ChangableObjectState<T extends object, K extends keyof T>
  extends SimpleObjectState<T, K>
  implements
    IChangable<K>,
    INestedChanges<K>,
    IOwnChanges,
    IToJSON<{ [key: string]: any }> {
  private _changes = new ObjectChanges<T, K>();

  // Overrides
  setProperty(prop: K, value: T[K]): void {
    this._props[prop] = value;
    this._changes.registerPropertyUpdate(prop);
  }

  // Implementation of interface INestedChanges
  get hasNestedChanges(): boolean {
    return this.getChangableEntries().some(([, x]) => x.changed);
  }

  clearNestedChanges(): void {
    this.getChangableEntries().forEach(([, x]) => x.clearChanges());
  }

  getNestedChanges(): TNestedChanges<K> {
    return this.getChangableEntries()
      .filter(
        ([prop, x]) => x.changed && !this._changes.isPropertyChanged(prop)
      )
      .map(([prop, x]) => [prop, x.getChanges()] as [K, TChanges<any>]);
  }

  setNestedChanges(changes: TNestedChanges<K>): void {
    changes.forEach(([prop, change]) => {
      const changable = (this._props[prop] as unknown) as IChangable<K>;
      changable.setChanges(change);
    });
  }

  getChangableEntries(): [K, IChangable<any>][] {
    const result = [] as [K, IChangable<any>][];

    this._propsKeys.forEach((prop) => {
      const changable = toChangable(this._props[prop]);
      if (changable) {
        result.push([prop, changable]);
      }
    });

    return result;
  }

  // Implementation of interface IOwnChanges
  get hasOwnChanges(): boolean {
    return this._changes.hasEnries;
  }

  clearOwnChanges(): void {
    this._changes.clear();
  }

  getOwnChanges(): TObjectChange {
    return this._changes.getChanges(this);
  }

  setOwnChanges(changes: TObjectChange): void {
    this.clearOwnChanges();

    changes.forEach((change) => {
      const [key, value] = change;
      const prop = key as K;
      this._props[prop] = value;
    });
  }

  // Implementation of interface IChangable
  isChangable: true = true;

  get changed(): boolean {
    return this.hasOwnChanges || this.hasNestedChanges;
  }

  clearChanges(): void {
    this.clearOwnChanges();
    this.clearNestedChanges();
  }

  getChanges(): [TObjectChange, TNestedChanges<K>] {
    return [this.getOwnChanges(), this.getNestedChanges()];
  }

  setChanges(changes: [TObjectChange, TNestedChanges<K>]): void {
    const [ownChanges, nestedChanges] = changes;
    this.setOwnChanges(ownChanges);
    this.setNestedChanges(nestedChanges);
  }

  // implementation of interface IToJSON
  toJSON(): { [keys: string]: any } {
    const result = {} as T;

    this._propsKeys.forEach((prop) => {
      result[prop] = this._props[prop];
    });

    return result;
  }

  // private and protected members
  protected get _propsKeys(): K[] {
    return Object.keys(this._props).map((key) => key as K);
  }
}
