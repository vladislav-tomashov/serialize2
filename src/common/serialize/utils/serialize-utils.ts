import {
  isSerializable,
  TSerializableValue,
  IFindSerializable,
  TSerializablePrimitive,
  ISerializable,
} from "../serializable-object/interfaces";

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

  throw new Error(`Cannot convert value="${value}" to TSerializableValue`);
};

const fromSerializedValue = <T>(
  serializableValue: TSerializableValue,
  objectsRegistry: IFindSerializable,
): TSerializablePrimitive | ISerializable<T> | never => {
  if (!Array.isArray(serializableValue)) {
    return serializableValue as TSerializablePrimitive;
  }

  const [id] = serializableValue;

  const result = objectsRegistry.findSerializableById<T>(id);

  if (!result) {
    throw new Error(`Object with id="${id}" was not found`);
  }

  return result;
};

export { toSerializedValue, fromSerializedValue };
