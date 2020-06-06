import { IClass3 } from "./IClass3";
import { IClass4 } from "./IClass4";
import { BaseSerializable } from "../serialize/serializable-object/BaseSerializable";
import { registerSerializableClass } from "../serialize/services/ClassesRegistry";

class Class4Serializable extends BaseSerializable<any, any> implements IClass4 {
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
