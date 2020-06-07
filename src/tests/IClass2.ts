import { IClass1 } from "./IClass1";
import { IArrayCollection } from "../common/collections";

export interface IClass2 {
  prop1: IClass1;
  prop2: IArrayCollection<IClass1>;
}
