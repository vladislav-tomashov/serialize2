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
import { ISystem } from "../../system/system.interface";
import { registerClass } from "../services/ClassesRegistry";

class ChangableArrayCollection<T> extends ArrayCollection<T>
  implements IChangableArrayCollection<T> {
  constructor(
    value?: any,
    private _id = getId(),
    private _context = getContext()
  ) {
    super(value);

    const changeObj = this._createChangesObject();
    changeObj.setAllPropertiesChanged();
  }

  // Interface ISerializable
  get serializable(): true {
    return true;
  }

  get id(): string {
    return this._id;
  }

  initialize({ id, context }: { id: string; context: ISystem }): void {
    if (this.id !== undefined) {
      throw new Error("initialize() can be called only once");
    }

    this._id = id;
    this._context = context;
  }

  applyChanges(changes: ICollectionChanges): void {
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
  protected _createChangesObject(): ArrayCollectionChanges<T> {
    const { changesRegistry } = this._context;
    const result = new ArrayCollectionChanges<T>();

    changesRegistry.set(this, result);

    return result;
  }

  protected _getChangeObject(): ArrayCollectionChanges<T> {
    const { changesRegistry } = this._context;
    const result = changesRegistry.get(this) as ArrayCollectionChanges<T>;

    return result ? result : this._createChangesObject();
  }

  protected _applyChange(change: ICollectionChange): void {
    const { op = CollectionChangeType.All, d } = change;
    const { objectsRegistry } = this._context;

    switch (op) {
      case CollectionChangeType.Splice: {
        const [start, deleteCount, items] = d as TCollectionSpliceChange<
          TSerializableValue
        >;

        const newItems = items
          ? items.map(
              (x) => (fromSerializedValue(x, objectsRegistry) as unknown) as T
            )
          : undefined;

        if (deleteCount && newItems) {
          super.splice(start, deleteCount, ...newItems);
        } else {
          super.splice(start, deleteCount);
        }
        break;
      }
      case CollectionChangeType.Push: {
        const items = d as TCollectionPushChange<TSerializableValue>;
        const newItems = items.map(
          (x) => (fromSerializedValue(x, objectsRegistry) as unknown) as T
        );

        super.push(...newItems);

        break;
      }
      case CollectionChangeType.Unshift: {
        const items = d as TCollectionUnshiftChange<TSerializableValue>;
        const newItems = items.map(
          (x) => (fromSerializedValue(x, objectsRegistry) as unknown) as T
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
        const items = d as TCollectionAllChange<TSerializableValue>;
        const newItems = items.map(
          (x) => (fromSerializedValue(x, objectsRegistry) as unknown) as T
        );

        this._array = newItems;

        break;
      }
      case CollectionChangeType.Set: {
        const [index, value] = d as TCollectionSetChange<TSerializableValue>;
        const newValue = (fromSerializedValue(
          value,
          objectsRegistry
        ) as unknown) as T;

        super.set(index, newValue);

        break;
      }
      default:
        throw new Error(`Unknown array change type=${op}`);
    }
  }
}

registerClass("ChangableArrayCollection", ChangableArrayCollection);

export { ChangableArrayCollection };
