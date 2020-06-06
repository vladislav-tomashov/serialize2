import { ISerializableClass } from "../../serializable-object/interfaces";

export interface IClassesRegistry {
  add<T>(classObject: ISerializableClass<T>): void;

  get<T>(className: string): ISerializableClass<T> | undefined;

  getOrThrow<T>(className: string): ISerializableClass<T>;

  clear(): void;
}
