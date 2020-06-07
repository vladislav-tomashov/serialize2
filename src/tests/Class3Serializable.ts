import { Class2Serializable, IClass2State } from "./Class2Serializable";
import { IClass3 } from "./IClass3";
import {
  ChangableArrayCollection,
  registerSerializableClass,
} from "../common/serialize";

interface IClass3State extends IClass2State {
  prop31: Class2Serializable;

  prop32: ChangableArrayCollection<Class2Serializable>;
}

class Class3Serializable extends Class2Serializable<IClass3State>
  implements IClass3 {
  constructor() {
    super();

    this.prop31 = new Class2Serializable();
    this.prop32 = new ChangableArrayCollection([
      new Class2Serializable(),
      new Class2Serializable(),
    ]);
  }

  // Proxied stateful properties
  public get prop31() {
    return this.getProperty("prop31") as Class2Serializable;
  }

  public set prop31(value: Class2Serializable) {
    this._setProperty("prop31", value);
  }

  public get prop32() {
    return this.getProperty("prop32") as ChangableArrayCollection<
      Class2Serializable
    >;
  }

  public set prop32(value: ChangableArrayCollection<Class2Serializable>) {
    this._setProperty("prop32", value);
  }
}

registerSerializableClass(Class3Serializable);

export { Class3Serializable };
