import { IClass3 } from "./IClass3";
import { IClass4 } from "./IClass4";
import {
  SerializableObject,
  registerSerializableClass,
} from "../common/serialize";

interface IClass4State {
  ref: IClass3;

  prop41: string;
}
class Class4Serializable extends SerializableObject<IClass4State>
  implements IClass4 {
  constructor(pRef: IClass3, pProp41: string) {
    super();

    this.ref = pRef;
    this.prop41 = pProp41;
  }

  // Proxied stateful properties
  public get ref() {
    return this.getProperty("ref") as IClass3;
  }

  public set ref(value: IClass3) {
    this._setProperty("ref", value);
  }

  public get prop41() {
    return this.getProperty("prop41") as string;
  }

  public set prop41(value: string) {
    this._setProperty("prop41", value);
  }
}

registerSerializableClass(Class4Serializable);

export { Class4Serializable };
