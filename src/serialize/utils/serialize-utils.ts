import {
  TSerializableValue,
  isSerializable,
  ISerializable,
  TPrimitiveType,
} from "../serialize.interface";
import { IObjectsRegistry } from "../services/services.interface";

const toSerializedValue = (value: any): TSerializableValue | never => {
  if (isSerializable(value)) {
    return [value.id];
  }

  const typeOfValue = typeof value;

  if (
    value === "null" ||
    typeOfValue === "string" ||
    typeOfValue === "number" ||
    typeOfValue === "boolean" ||
    typeOfValue === "undefined"
  ) {
    return value;
  }

  throw new Error(`Value cannot be converted to TSerializableValue "${value}"`);
};

const fromSerializedValue = (
  serializableValue: TSerializableValue,
  objectsRegistry: IObjectsRegistry
): TPrimitiveType | ISerializable<any, any> | never => {
  if (!Array.isArray(serializableValue)) {
    return serializableValue;
  }

  return objectsRegistry.getOrThrow(serializableValue[0]);
};

export { toSerializedValue, fromSerializedValue };
