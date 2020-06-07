import { IApplicationContext, IContextService } from "./interfaces";

class ContextService implements IContextService {
  private _context?: IApplicationContext;

  setContext(context: IApplicationContext): void {
    this._context = context;
  }

  getContext(): IApplicationContext | undefined {
    return this._context;
  }

  getContextOrThrow(): IApplicationContext {
    if (this._context === undefined) {
      throw new Error("Application context is undefined");
    }

    return this._context;
  }

  resetContext(): void {
    this._context = undefined;
  }
}

const applicationContext = new ContextService();

const setApplicationContext = (context: IApplicationContext): void => {
  applicationContext.setContext(context);
};

const getApplicationContext = (): IApplicationContext | undefined => {
  return applicationContext.getContext();
};

const resetApplicationContext = (): void => {
  applicationContext.resetContext();
};

const getApplicationContextOrThrow = (): IApplicationContext => {
  return applicationContext.getContextOrThrow();
};

export {
  getApplicationContext,
  setApplicationContext,
  getApplicationContextOrThrow,
  resetApplicationContext,
};
