import { ISystem } from "../system/system.interface";

export interface IContext {
  setContext(context: ISystem): void;

  getContext(): ISystem;
}
