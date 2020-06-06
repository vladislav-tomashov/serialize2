import { IArrayCollection } from "./interfaces";

interface IToArray<T> {
  toArray(): T[];
}

class ArrayCollection<T> implements IArrayCollection<T> {
  protected _array: Array<T> = [];

  constructor(value: Array<T>);

  constructor(value: IToArray<T>);

  constructor(value: any) {
    const array = Array.isArray(value) ? value : value.toArray();
    this._array = array;
  }

  get length() {
    return this._array.length;
  }

  toString(): string {
    return this._array.toString();
  }

  push(...items: T[]): number {
    return this._array.push(...items);
  }

  concat(...items: ConcatArray<T>[]): T[];

  concat(...items: (T | ConcatArray<T>)[]): T[];

  concat(...items: any[]) {
    return this._array.concat(...items);
  }

  join(separator?: string | undefined): string {
    return this._array.join(separator);
  }

  reverse(): T[] {
    return this._array.reverse();
  }

  shift(): T | undefined {
    return this._array.shift();
  }

  slice(start?: number | undefined, end?: number | undefined): T[] {
    return this._array.slice(start, end);
  }

  sort(compareFn?: ((a: T, b: T) => number) | undefined): this {
    this._array.sort(compareFn);
    return this;
  }

  splice(start: number, deleteCount?: number | undefined): T[];

  splice(start: number, deleteCount: number, ...items: T[]): T[];

  splice(start: any, deleteCount?: any, ...rest: any[]) {
    return this._array.splice(start, deleteCount, ...rest);
  }

  unshift(...items: T[]): number {
    return this._array.unshift(...items);
  }

  indexOf(searchElement: T, fromIndex?: number | undefined): number {
    return this._array.indexOf(searchElement, fromIndex);
  }

  lastIndexOf(searchElement: T, fromIndex?: number | undefined): number {
    return this._array.lastIndexOf(searchElement, fromIndex);
  }

  every(
    callbackfn: (value: T, index: number, array: T[]) => unknown,
    thisArg?: any,
  ): boolean {
    return this._array.every(callbackfn, thisArg);
  }

  some(
    callbackfn: (value: T, index: number, array: T[]) => unknown,
    thisArg?: any,
  ): boolean {
    return this._array.some(callbackfn, thisArg);
  }

  forEach(
    callbackfn: (value: T, index: number, array: T[]) => void,
    thisArg?: any,
  ): void {
    return this._array.forEach(callbackfn, thisArg);
  }

  map<U>(
    callbackfn: (value: T, index: number, array: T[]) => U,
    thisArg?: any,
  ): U[] {
    return this._array.map(callbackfn, thisArg);
  }

  filter<S extends T>(
    callbackfn: (value: T, index: number, array: T[]) => value is S,
    thisArg?: any,
  ): S[];

  filter(
    callbackfn: (value: T, index: number, array: T[]) => unknown,
    thisArg?: any,
  ): T[];

  filter(callbackfn: any, thisArg?: any) {
    return this._array.filter(callbackfn, thisArg);
  }

  reduce(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[],
    ) => T,
  ): T;

  reduce(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[],
    ) => T,
    initialValue: T,
  ): T;

  reduce<U>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[],
    ) => U,
    initialValue: U,
  ): U;

  reduce(callbackfn: any, initialValue?: any) {
    return this._array.reduce(callbackfn, initialValue);
  }

  reduceRight(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[],
    ) => T,
  ): T;

  reduceRight(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[],
    ) => T,
    initialValue: T,
  ): T;

  reduceRight<U>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[],
    ) => U,
    initialValue: U,
  ): U;

  reduceRight(callbackfn: any, initialValue?: any) {
    return this._array.reduceRight(callbackfn, initialValue);
  }

  toArray() {
    return this._array;
  }

  get(index: number): T | undefined {
    return this._array[index];
  }

  set(index: number, value: T) {
    this._array[index] = value;
  }

  pop(): T | undefined {
    return this._array.pop();
  }

  clear() {
    this._array.length = 0;
  }

  toJSON() {
    return this._array;
  }
}

export { ArrayCollection };
