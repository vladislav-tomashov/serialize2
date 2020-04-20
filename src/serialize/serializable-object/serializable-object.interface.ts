import { IChange, TSerializableValue, IChanges } from "../serialize.interface";

export interface IBaseState {}

export type TPropertyChange = [string, TSerializableValue];

export interface IObjectChange extends IChange {
  d: TPropertyChange;
}

export interface IObjectChanges extends IChanges {
  log: IObjectChange[];
}

export enum ObjectChangeType {
  PropertyChange,
}
