import { ISerializable, IChanges } from "../../serializable-object/interfaces";

export interface IChangesRegistry {
  add<T>(serializable: ISerializable<T>): void;

  has<T>(serializable: ISerializable<T>): boolean;

  isEmpty(): boolean;

  getChangesAsJson(): IChanges[];

  clear(): void;
}
