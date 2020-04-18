import { ISystem } from "../system/system.interface";
import { IContext } from "./context.interface";

class Context implements IContext {
  private _context: ISystem | undefined = undefined;

  setContext = (context: ISystem) => {
    this._context = context;
  };

  getContext = (): ISystem => {
    if (this._context === undefined) {
      throw new Error("Context is not set.");
    }

    return this._context;
  };
}

const context = new Context();
const setContext = context.setContext;
const getContext = context.getContext;

export { setContext, getContext };
