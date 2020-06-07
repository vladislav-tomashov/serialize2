import { IIdGenerator } from "../utils";
import { ISerializationContext } from "../serialize/serializable-object/interfaces";

export interface IApplicationContext {
  readonly idGenerator: IIdGenerator;

  readonly serializationContext: ISerializationContext;
}

export interface IContextService {
  setContext(context: IApplicationContext): void;

  resetContext(): void;

  getContext(): IApplicationContext | undefined;

  getContextOrThrow(): IApplicationContext;
}
