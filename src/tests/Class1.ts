import { IClass1 } from "./IClass1";

export class Class1 implements IClass1 {
  private _prop1 = "Hello!"; // serialize

  private _prop4: string; // do not serialize

  private _arr: number[]; // serialize

  protected _prop2 = 0; // serialize

  prop3: string; // serialize

  constructor(arg1: number, arg2: string) {
    if (arg1 === 1) {
      this._prop2 = 5;
      this._prop4 = "goodbye" + this._prop1;
      this._arr = [1, 2, 3];
    } else {
      this._prop2 = 6;
      this._prop4 = "hello";
      this._arr = [4, 5, 6];
    }

    this.prop3 = "abc" + this._prop4;
  }

  func1(): void {
    this._prop2 += 1;
    this._arr.push(10);
  }
}
