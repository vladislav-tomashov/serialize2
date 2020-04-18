import { ArrayCollectionChanges } from "./ArrayCollectionChanges";
import { ArrayCollection } from "../../collections/ArrayCollection";
import {
  TCollectionSpliceChange,
  TCollectionPushChange,
  TCollectionUnshiftChange,
  TCollectionAllChange,
  TCollectionSetChange,
  IChangableArrayCollection,
  ICollectionChange,
  CollectionChangeType,
  ICollectionChanges,
} from "./changable-collections.interface";
import { getId } from "../utils/id-utils";
import { getContext } from "../../context/context";
import { TSerializableValue } from "../serialize.interface";
import { fromSerializedValue } from "../utils/serialize-utils";

export class ChangableArrayCollection<T> extends ArrayCollection<T>
  implements IChangableArrayCollection<T> {
  private _id = getId();

  constructor(value: any) {
    super(value);

    const { changes } = getContext();
    const changeObj = new ArrayCollectionChanges<T>();

    changeObj.setAllPropertiesChanged();
    changes.setChangeObject(this, changeObj);
  }

  // Interface ISerializable
  serializable: true = true;

  get id(): string {
    return this._id;
  }

  applyChanges(changes: ICollectionChanges): void {
    if (changes.className !== this.getClassName()) {
      throw new Error(
        `Cannot applyChanges, because changes have different className: "${changes.className}" !== "this.getClassName()"`
      );
    }

    this._id = changes.id;

    changes.log.forEach((change) => {
      this._applyChange(change);
    });
  }

  getClassName(): string {
    return this.constructor.name;
  }

  // interface IGetProperty
  getProperty(prop: number): T {
    return this._array[prop];
  }

  getAllProperties(): T[] {
    return this._array;
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
  protected _getChangeObject(): ArrayCollectionChanges<T> {
    const { changes } = getContext();
    const existingChageObj = changes.getChangeObject(
      this
    ) as ArrayCollectionChanges<T>;

    if (existingChageObj) {
      return existingChageObj;
    }

    const newChangeObj = new ArrayCollectionChanges<T>();
    changes.setChangeObject(this, newChangeObj);

    return newChangeObj;
  }

  protected _applyChange(change: ICollectionChange): void {
    const { operation, data } = change;

    switch (operation) {
      case CollectionChangeType.Splice: {
        const [start, deleteCount, items] = data as TCollectionSpliceChange<
          TSerializableValue
        >;

        const newItems = items
          ? items.map((x) => (fromSerializedValue(x) as unknown) as T)
          : undefined;

        if (deleteCount && newItems) {
          super.splice(start, deleteCount, ...newItems);
        } else {
          super.splice(start, deleteCount);
        }
        break;
      }
      case CollectionChangeType.Push: {
        const items = data as TCollectionPushChange<TSerializableValue>;
        const newItems = items.map(
          (x) => (fromSerializedValue(x) as unknown) as T
        );
        super.push(...newItems);
        break;
      }
      case CollectionChangeType.Unshift: {
        const items = data as TCollectionUnshiftChange<TSerializableValue>;
        const newItems = items.map(
          (x) => (fromSerializedValue(x) as unknown) as T
        );
        super.unshift(...newItems);
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
      case CollectionChangeType.All: {
        const items = data as TCollectionAllChange<TSerializableValue>;
        const newItems = items.map(
          (x) => (fromSerializedValue(x) as unknown) as T
        );
        this._array = newItems;
        break;
      }
      case CollectionChangeType.Set: {
        const [index, value] = data as TCollectionSetChange<TSerializableValue>;
        const newValue = (fromSerializedValue(value) as unknown) as T;
        super.set(index, newValue);
        break;
      }
      default:
        throw new Error(`Unknown array change type=${operation}`);
    }
  }
}
