import {
  TCollectionChange,
  CollectionChangeType,
  ICollectionChanges,
} from "./changable-collections.interface";
import {
  IChangeObject,
  TSerializableValue,
  ISerializable,
} from "../serialize.interface";
import { toSerializedValue } from "../utils/serialize-utils";

type TPushChange<T> = [CollectionChangeType.Push, T[]];

type TUnshiftChange<T> = [CollectionChangeType.Unshift, T[]];

type TPopChange = [CollectionChangeType.Pop];

type TShiftChange = [CollectionChangeType.Shift];

type TAllChange = [CollectionChangeType.All];

type TSetChange<T> = [CollectionChangeType.Set, number, T];

type TSpliceChange<T> = [
  CollectionChangeType.Splice,
  number,
  number | undefined,
  T[] | undefined
];

type TChange<T> =
  | TAllChange
  | TPopChange
  | TShiftChange
  | TSetChange<T>
  | TUnshiftChange<T>
  | TPushChange<T>
  | TSpliceChange<T>;

function getChange<T>(
  change: TChange<T>,
  source: ISerializable<T[], number>
): TCollectionChange<TSerializableValue> | undefined | never {
  const [changeType] = change;

  switch (changeType) {
    case CollectionChangeType.Push: {
      const typedChange = change as TPushChange<T>;
      const [, items] = typedChange;
      return items.map((x) => toSerializedValue(x));
    }
    case CollectionChangeType.Unshift: {
      const typedChange = change as TUnshiftChange<T>;
      const [, items] = typedChange;
      return items.map((x) => toSerializedValue(x));
    }
    case CollectionChangeType.Pop: {
      return undefined;
    }
    case CollectionChangeType.Shift: {
      return undefined;
    }
    case CollectionChangeType.All: {
      return source.getAllProperties().map((x) => toSerializedValue(x));
    }
    case CollectionChangeType.Set: {
      const typedChange = change as TSetChange<T>;
      const [, index, value] = typedChange;
      return [index, toSerializedValue(value)];
    }
    case CollectionChangeType.Splice: {
      const typedChange = change as TSpliceChange<T>;
      const [, start, deleteCount, items] = typedChange;
      const serializedItems = items
        ? items.map((x) => toSerializedValue(x))
        : undefined;
      return [start, deleteCount, serializedItems];
    }
    default:
      throw new Error(`Unknown array change type=${changeType}`);
  }
}

export class ArrayCollectionChanges<T> implements IChangeObject<T[], number> {
  private _log: TChange<T>[] = [];

  private _allPropertiesChanged = false;

  setAllPropertiesChanged(): void {
    this._allPropertiesChanged = true;
  }

  registerSplice(start: number, deleteCount: number, items: T[]) {
    if (this._allPropertiesChanged) {
      return;
    }

    const change = [
      CollectionChangeType.Splice,
      start,
      deleteCount,
      items,
    ] as TSpliceChange<T>;

    this._log.push(change);
  }

  registerSet(index: number, value: T) {
    if (this._allPropertiesChanged) {
      return;
    }

    const change = [CollectionChangeType.Set, index, value] as TSetChange<T>;
    this._log.push(change);
  }

  registerPop() {
    if (this._allPropertiesChanged) {
      return;
    }

    const change = [CollectionChangeType.Pop] as TPopChange;
    this._log.push(change);
  }

  registerShift() {
    if (this._allPropertiesChanged) {
      return;
    }

    const change = [CollectionChangeType.Shift] as TShiftChange;
    this._log.push(change);
  }

  registerClear() {
    if (this._allPropertiesChanged) {
      return;
    }

    this._log = [];
    this._allPropertiesChanged = true;
  }

  registerSort() {
    if (this._allPropertiesChanged) {
      return;
    }

    this._log = [];
    this._allPropertiesChanged = true;
  }

  registerReverse() {
    if (this._allPropertiesChanged) {
      return;
    }

    this._log = [];
    this._allPropertiesChanged = true;
  }

  registerPush(items: T[]) {
    if (this._allPropertiesChanged) {
      return;
    }

    const change = [CollectionChangeType.Push, items] as TPushChange<T>;
    this._log.push(change);
  }

  registerUnshift(items: T[]) {
    if (this._allPropertiesChanged) {
      return;
    }

    const change = [CollectionChangeType.Unshift, items] as TUnshiftChange<T>;
    this._log.push(change);
  }

  getChanges(
    source: ISerializable<T[], number>
  ): ICollectionChanges | undefined {
    const id = source.id;
    const className = source.getClassName();

    if (this._allPropertiesChanged) {
      const change: TAllChange = [CollectionChangeType.All];
      const log = [change].map((x) => ({
        d: getChange(x, source),
      }));

      return { id, className, log };
    }

    if (!this._log.length) {
      return undefined;
    }

    const log = this._log.map((change) => {
      const d = getChange(change, source);
      const op = change[0];

      return d ? { op, d } : { op };
    });

    return { id, log };
  }
}
