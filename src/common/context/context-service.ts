import { IApplicationContext, IContextService } from "./interfaces";

class ContextService implements IContextService {
  private _context?: IApplicationContext;

  setContext(context: IApplicationContext | undefined): void {
    this._context = context;
  }

  getContext(): IApplicationContext | undefined {
    return this._context;
  }
}

const applicationContext = new ContextService();

const setApplicationContext = (
  context: IApplicationContext | undefined
): void => {
  applicationContext.setContext(context);
};

const getApplicationContext = (): IApplicationContext | undefined => {
  return applicationContext.getContext();
};

const getApplicationContextOrThrow = (): IApplicationContext => {
  const result = applicationContext.getContext();

  if (result === undefined) {
    throw new Error("Application context is undefined");
  }

  return result;
};

export {
  getApplicationContext,
  setApplicationContext,
  getApplicationContextOrThrow,
};
