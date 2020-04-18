import {
  TSerializableValue,
  isSerializable,
  ValueType,
  ISerializable,
  TPrimitiveType,
} from "../serialize.interface";
import { getContext } from "../../context/context";
import { System } from "../../system/System";

const toSerializableValue = (value: any): TSerializableValue | never => {
  if (isSerializable(value)) {
    return [ValueType.ref, value.id];
  }

  const typeOfValue = typeof value;

  if (
    value === "null" ||
    typeOfValue === "string" ||
    typeOfValue === "number" ||
    typeOfValue === "boolean" ||
    typeOfValue === "undefined"
  ) {
    return [ValueType.ref, value];
  }

  throw new Error(`Value cannot be converted to TSerializableValue "${value}"`);
};

const fromSerializableValue = (
  serializableValue: TSerializableValue
): TPrimitiveType | ISerializable | never => {
  const [valueType, value] = serializableValue;

  if (valueType === ValueType.primitive) {
    return value;
  }

  const { objects } = getContext() as System;
  const obj = objects.getObject(value as string);

  if (!obj) {
    throw new Error(`Object with id="${value}" is not found in system table.`);
  }

  return obj;
};

export { toSerializableValue, fromSerializableValue };
