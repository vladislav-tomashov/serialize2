import {
  ISerializableClasses,
  ISerializableObjects,
  ISystemChanges,
} from "../serialize/services/services.interface";

export interface ISystem {
  readonly classes: ISerializableClasses;
  readonly objects: ISerializableObjects;
  readonly changes: ISystemChanges;
}
