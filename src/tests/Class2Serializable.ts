import { IClass2 } from "./IClass2";
import { Class1Serializable } from "./Class1Serializable";
import {
  ChangableArrayCollection,
  SerializableObject,
  registerSerializableClass,
} from "../common/serialize";

export interface IClass2State {
  prop1: Class1Serializable;

  prop2: ChangableArrayCollection<Class1Serializable>;
}

class Class2Serializable<T extends IClass2State = IClass2State>
  extends SerializableObject<T>
  implements IClass2 {
  constructor() {
    super();

    this.prop1 = new Class1Serializable(5, "abc");
    this.prop2 = new ChangableArrayCollection([
      new Class1Serializable(1, "test1"),
      new Class1Serializable(2, "test2"),
    ]);
  }

  // Proxied state properties
  public get prop1() {
    return (this.getProperty("prop1") as unknown) as Class1Serializable;
  }

  public set prop1(value: Class1Serializable) {
    this._setProperty("prop1", (value as unknown) as T[keyof T]);
  }

  public get prop2() {
    return (this.getProperty("prop2") as unknown) as ChangableArrayCollection<
      Class1Serializable
    >;
  }

  public set prop2(value: ChangableArrayCollection<Class1Serializable>) {
    this._setProperty("prop2", (value as unknown) as T[keyof T]);
  }
}

registerSerializableClass(Class2Serializable);

export { Class2Serializable };
