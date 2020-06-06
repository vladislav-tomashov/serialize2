import { ArrayCollection } from "../../collections";
import {
  IChangableArrayCollection,
  ICollectionChanges,
  ICollectionChange,
  TCollectionSpliceChange,
  TCollectionPushChange,
  TCollectionUnshiftChange,
  TCollectionAllChange,
  TCollectionSetChange,
} from "./interfaces";
import { ArrayCollectionChanges } from "./array-collection-changes";
import { CollectionChangeType } from "./collection-change-type";
import {
  TSerializableValue,
  ISerializableInitParams,
  ISerializationContext,
} from "../serializable-object";
import { fromSerializedValue } from "../utils";
import { registerSerializableClass } from "../services";

class BaseChangableArrayCollection<TItem> extends ArrayCollection<TItem>
  implements IChangableArrayCollection<TItem> {
  private _changes?: ArrayCollectionChanges<TItem>;

  private _changed = true;

  constructor(
    private _id: string,
    value?: any,
    private _serializationContext?: ISerializationContext
  ) {
    super(value);

    if (_serializationContext) {
      _serializationContext.setChanged(this);

      this._changes = new ArrayCollectionChanges<TItem>();
    }
  }

  // Interface ISerializable
  // eslint-disable-next-line class-methods-use-this
  get serializable(): true {
    return true;
  }

  get id(): string {
    return this._id;
  }

  init({ id, context }: ISerializableInitParams): void {
    if (this.id !== undefined) {
      throw new Error("initialize() can be called only once");
    }

    this._id = id;
    this._serializationContext = context;
  }

  getChanges(): ICollectionChanges {
    if (!this._changes) {
      throw new Error(`Changes were not created`);
    }

    return (this._changes as ArrayCollectionChanges<TItem>).getChanges(this);
  }

  clearChanges(): void {
    if (!this._changed) {
      return;
    }

    this._changed = false;

    if (!this._changes) {
      return;
    }

    this._changes.clear();
  }

  setChanges(changes: ICollectionChanges): void {
    if (!this._serializationContext) {
      throw new Error(`Serialization context was not provided`);
    }

    // if (this._changed) {
    //   throw new Error("Object is changed!");
    // }

    this._changed = false;

    changes.log.forEach((change) => {
      this._applyChange(change);
    });
  }

  getClassName(): string {
    return this.constructor.name;
  }

  // interface IGetProperty
  getProperty(prop: number): TItem {
    return this._array[prop];
  }

  getAllProperties(): TItem[] {
    return this._array;
  }

  // redefine some methods from parent
  set(index: number, value: TItem): void {
    super.set(index, value);

    if (this._changes) {
      this._changes.registerSet(index, value);
      this._setChanged();
    }
  }

  pop(): TItem | undefined {
    const result = super.pop();

    if (this._changes) {
      this._changes.registerPop();
      this._setChanged();
    }

    return result;
  }

  push(...items: TItem[]): number {
    const result = super.push(...items);

    if (this._changes) {
      this._changes.registerPush(items);
      this._setChanged();
    }

    return result;
  }

  reverse(): TItem[] {
    const result = super.reverse();

    if (this._changes) {
      this._changes.registerReverse();
      this._setChanged();
    }

    return result;
  }

  clear(): void {
    super.clear();

    if (this._changes) {
      this._changes.registerClear();
      this._setChanged();
    }
  }

  sort(compareFn?: ((a: TItem, b: TItem) => number) | undefined): this {
    super.sort(compareFn);

    if (this._changes) {
      this._changes.registerSort();
      this._setChanged();
    }

    return this;
  }

  unshift(...items: TItem[]): number {
    const result = super.unshift(...items);

    if (this._changes) {
      this._changes.registerUnshift(items);
      this._setChanged();
    }

    return result;
  }

  shift(): TItem | undefined {
    const result = super.shift();

    if (this._changes) {
      this._changes.registerShift();
      this._setChanged();
    }

    return result;
  }

  splice(start: number, deleteCount?: number | undefined): TItem[];

  splice(start: number, deleteCount: number, ...items: TItem[]): TItem[];

  splice(start: any, deleteCount?: any, ...rest: any[]) {
    const result = super.splice(start, deleteCount, ...rest);

    if (this._changes) {
      this._changes.registerSplice(start, deleteCount, rest);
      this._setChanged();
    }

    return result;
  }

  // private and protected
  protected _applyChange(change: ICollectionChange): void {
    const { op = CollectionChangeType.All, d } = change;

    switch (op) {
      case CollectionChangeType.Splice: {
        const [start, deleteCount, items] = d as TCollectionSpliceChange<
          TSerializableValue
        >;

        const newItems = items
          ? items.map(
              (x) =>
                (fromSerializedValue(
                  x,
                  this._serializationContext as ISerializationContext
                ) as unknown) as TItem
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
          (x) =>
            (fromSerializedValue(
              x,
              this._serializationContext as ISerializationContext
            ) as unknown) as TItem
        );

        super.push(...newItems);

        break;
      }

      case CollectionChangeType.Unshift: {
        const items = d as TCollectionUnshiftChange<TSerializableValue>;
        const newItems = items.map(
          (x) =>
            (fromSerializedValue(
              x,
              this._serializationContext as ISerializationContext
            ) as unknown) as TItem
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
          (x) =>
            (fromSerializedValue(
              x,
              this._serializationContext as ISerializationContext
            ) as unknown) as TItem
        );

        this._array = newItems;

        break;
      }

      case CollectionChangeType.Set: {
        const [index, value] = d as TCollectionSetChange<TSerializableValue>;
        const newValue = (fromSerializedValue(
          value,
          this._serializationContext as ISerializationContext
        ) as unknown) as TItem;

        super.set(index, newValue);

        break;
      }

      default:
        throw new Error(`Unknown array change type=${op}`);
    }
  }

  private _setChanged() {
    if (!this._changed) {
      (this._serializationContext as ISerializationContext).setChanged(this);
    }
  }
}

registerSerializableClass(BaseChangableArrayCollection);

export { BaseChangableArrayCollection };
