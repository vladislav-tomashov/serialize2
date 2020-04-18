import { IChange, TSerializableValue, IChanges } from "../serialize.interface";

export interface IBaseState {}

export interface IObjectChange extends IChange {
  property: string;
  value: TSerializableValue;
}

export interface IObjectChanges extends IChanges {
  log: IObjectChange[];
}
