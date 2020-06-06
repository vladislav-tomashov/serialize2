import {
  ISerializable,
  IChanges,
  ISerializationContext,
} from "../../serializable-object/interfaces";

export interface IObjectsRegistry {
  add<T>(obj: ISerializable<T>): void;

  addMany(arr: ISerializable<any>[]): void;

  get<T>(id: string): ISerializable<T> | undefined;

  getOrThrow<T>(id: string): ISerializable<T>;

  clear(): void;

  updateObjects(
    changes: IChanges[],
    context: ISerializationContext,
  ): ISerializable<any>[];
}
