import { BaseChangableArrayCollection } from "./base-changable-array-collection";
import { registerSerializableClass } from "../services";
import { getApplicationContextOrThrow } from "../../context";

class ChangableArrayCollection<TItem> extends BaseChangableArrayCollection<
  TItem
> {
  constructor(
    value?: any,
    { idGenerator, serializationContext } = getApplicationContextOrThrow()
  ) {
    super(idGenerator.nextId(), value, serializationContext);
  }
}

registerSerializableClass(ChangableArrayCollection);

export { ChangableArrayCollection };
