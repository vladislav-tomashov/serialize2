import { ArrayCollectionChanges } from "./ArrayCollectionChanges";
import { ArrayCollection } from "../../collections/ArrayCollection";
import {
  TCollectionChange,
  CollectionChangeType,
  TCollectionSpliceChange,
  TCollectionPushChange,
  TCollectionUnshiftChange,
  TCollectionClearChange,
  TCollectionSortChange,
  TCollectionReverseChange,
  TCollectionSetChange,
} from "./changable-collections.interface";
import { ISerializableState, ISerializable } from "../serialize.interface";
import { getId } from "../utils/id-utils";
import { getContext } from "../../context/context";
import { System } from "../../system/System";

export interface IChangableArrayCollectionState<T> extends ISerializableState {
  array: T[];
}

export class ChangableArrayCollection<T> extends ArrayCollection<T>
  implements ISerializable<IChangableArrayCollectionState<T>, number> {
  private _id = getId();

  protected _state: IChangableArrayCollectionState<T> = {
    className: this.getClassName(),
    array: this._array,
  };

  // Interface ISerializable
  serializable: true = true;

  get id(): string {
    return this._id;
  }

  applyChanges(changes: TCollectionChange<T>[]) {
    changes.forEach((change) => this._applyChange(change));
  }

  getState(): IChangableArrayCollectionState<T> {
    return this._state;
  }

  setState(state: IChangableArrayCollectionState<T>): void {
    if (this._state.className !== state.className) {
      throw new Error(
        `BaseSerializable.setState(): incoming state className="${state.className}" differs from current className="${this._state.className}"`
      );
    }

    this._state = state;
  }

  getClassName(): string {
    return this.constructor.name;
  }

  protected _getChangeObject(): ArrayCollectionChanges<T> {
    const { changes } = getContext() as System;
    const result = changes.getChangeObject(this) as ArrayCollectionChanges<T>;

    if (result) {
      return result;
    }

    const newChanges = new ArrayCollectionChanges<T>();
    changes.setChangeObject(this, newChanges);

    return newChanges;
  }

  // redefine some methods from parent
  set(index: number, value: T): void {
    super.set(index, value);
    this._getChangeObject().registerSet(index, value);
  }

  pop(): T | undefined {
    const result = super.pop();
    this._getChangeObject().registerPop();
    return result;
  }

  push(...items: T[]): number {
    const result = super.push(...items);
    this._getChangeObject().registerPush(items);
    return result;
  }

  reverse(): T[] {
    const result = super.reverse();
    this._getChangeObject().registerReverse();
    return result;
  }

  clear(): void {
    super.clear();
    this._getChangeObject().registerClear();
  }

  sort(compareFn?: ((a: T, b: T) => number) | undefined): this {
    super.sort(compareFn);
    this._getChangeObject().registerSort();
    return this;
  }

  unshift(...items: T[]): number {
    const result = super.unshift(...items);
    this._getChangeObject().registerUnshift(items);
    return result;
  }

  shift(): T | undefined {
    const result = super.shift();
    this._getChangeObject().registerShift();
    return result;
  }

  splice(start: number, deleteCount?: number | undefined): T[];

  splice(start: number, deleteCount: number, ...items: T[]): T[];

  splice(start: any, deleteCount?: any, ...rest: any[]) {
    const result = super.splice(start, deleteCount, ...rest);
    this._getChangeObject().registerSplice(start, deleteCount, rest);
    return result;
  }

  // private and protected
  protected _applyChange(change: TCollectionChange<T>) {
    const [changeType] = change;

    switch (changeType) {
      case CollectionChangeType.Splice: {
        const [, start, deleteCount, items] = change as TCollectionSpliceChange<
          T
        >;
        if (deleteCount && items) {
          super.splice(start, deleteCount, ...items);
        } else {
          super.splice(start, deleteCount);
        }
        break;
      }
      case CollectionChangeType.Push: {
        const [, items] = change as TCollectionPushChange<T>;
        super.push(...items);
        break;
      }
      case CollectionChangeType.Unshift: {
        const [, items] = change as TCollectionUnshiftChange<T>;
        super.unshift(...items);
        break;
      }
      case CollectionChangeType.Pop: {
        super.pop();
        break;
      }
      case CollectionChangeType.Shift: {
        super.shift();
        break;
      }
      case CollectionChangeType.Clear: {
        const [, items] = change as TCollectionClearChange<T>;
        super.clear();
        super.push(...items);
        break;
      }
      case CollectionChangeType.Sort: {
        const [, items] = change as TCollectionSortChange<T>;
        super.clear();
        super.push(...items);
        break;
      }
      case CollectionChangeType.Reverse: {
        const [, items] = change as TCollectionReverseChange<T>;
        super.clear();
        super.push(...items);
        break;
      }
      case CollectionChangeType.Set: {
        const [, index, value] = change as TCollectionSetChange<T>;
        super.set(index, value);
        break;
      }
      default:
        throw new Error(`Unknown array change type=${changeType}`);
    }
  }
}
