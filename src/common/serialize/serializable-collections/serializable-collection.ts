import { BaseSerializableCollection } from "./base-serializable-collection";
import { registerSerializableClass } from "../services";
import { getApplicationContextOrThrow } from "../../context";

class SerializableCollection<TItem> extends BaseSerializableCollection<TItem> {
  constructor(
    value?: any,
    { idGenerator, serializationContext } = getApplicationContextOrThrow()
  ) {
    super(idGenerator.nextId(), value, serializationContext);
  }
}

registerSerializableClass(SerializableCollection);

export { SerializableCollection };
