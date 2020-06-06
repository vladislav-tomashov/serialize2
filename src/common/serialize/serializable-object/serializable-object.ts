import { registerSerializableClass } from "../services";
import { BaseSerializable } from "./base-serializable";
import { getApplicationContextOrThrow } from "../../context";

class SerializableObject<TState> extends BaseSerializable<TState> {
  constructor(
    { idGenerator, serializationContext } = getApplicationContextOrThrow()
  ) {
    super(idGenerator.nextId(), serializationContext);
  }
}

registerSerializableClass(SerializableObject);

export { SerializableObject };
