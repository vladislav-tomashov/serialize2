import {
  IChange,
  TSerializableValue,
  IChanges,
  ISerializable,
  IGetProperty,
} from "../serialize.interface";

export interface IBaseState {}

export interface IObjectChange extends IChange {
  property: string;
  value: TSerializableValue;
}

export interface IObjectChanges extends IChanges {
  log: IObjectChange[];
}

export interface IBaseSerializable<T, K extends keyof T>
  extends ISerializable,
    IGetProperty<T, K> {}
