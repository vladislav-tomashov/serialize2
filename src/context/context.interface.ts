import { ISystem } from "../system/system.interface";

export interface IContext {
  setContext(context: ISystem | undefined): void;

  getContext(): ISystem;
}
