import { IClass4 } from "./IClass4";
import { IClass3 } from "./IClass3";

export class Class4 implements IClass4 {
  ref: IClass3;

  prop41: string;

  constructor(pRef: IClass3, pProp41: string) {
    this.ref = pRef;
    this.prop41 = pProp41;
  }
}
