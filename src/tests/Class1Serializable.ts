import { IClass1 } from "./IClass1";
import {
  ChangableArrayCollection,
  SerializableObject,
  registerSerializableClass,
} from "../common/serialize";

interface IClass1State {
  _prop1: string;

  _prop2: number;

  prop3: string;

  _prop4: string;

  _arr: ChangableArrayCollection<number>;
}

class Class1Serializable extends SerializableObject<IClass1State>
  implements IClass1 {
  // not serializable
  private _prop4: string;

  constructor(arg1: number, arg2: string) {
    super();

    // Init properties with default values
    this._prop1 = "Hello!";
    this._prop2 = 0;

    // Copied from Class1 constructor
    if (arg1 === 1) {
      this._prop2 = 5;
      this._prop4 = "goodbye" + this._prop1;
      this._arr = new ChangableArrayCollection<number>([1, 2, 3]);
    } else {
      this._prop2 = 6;
      this._prop4 = "hello";
      this._arr = new ChangableArrayCollection<number>([4, 5, 6]);
    }

    this.prop3 = "abc" + this._prop4;
  }

  // Proxied state properties
  private get _prop1() {
    return this.getProperty("_prop1") as string;
  }

  private set _prop1(value: string) {
    this._setProperty("_prop1", value);
  }

  protected get _prop2() {
    return this.getProperty("_prop2") as number;
  }

  protected set _prop2(value: number) {
    this._setProperty("_prop2", value);
  }

  get prop3() {
    return this.getProperty("prop3") as string;
  }

  set prop3(value: string) {
    this._setProperty("prop3", value);
  }

  private get _arr() {
    return this.getProperty("_arr") as ChangableArrayCollection<number>;
  }

  private set _arr(value: ChangableArrayCollection<number>) {
    this._setProperty("_arr", value);
  }

  // copied Class1 methods
  func1(): void {
    this._prop2 += 1;
    this._arr.push(10);
  }
}

registerSerializableClass(Class1Serializable);

export { Class1Serializable };
