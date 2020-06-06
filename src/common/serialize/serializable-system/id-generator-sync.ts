import { BaseSerializable, IObjectChanges } from "../serializable-object";
import { registerSerializableClass } from "../services";
import { getApplicationContextOrThrow } from "../../context";

export interface IStaticVariablesSyncState {
  currentId: number;
}

class IdGeneratorSync extends BaseSerializable<IStaticVariablesSyncState> {
  refresh() {
    const { idGenerator } = getApplicationContextOrThrow();
    this.currentId = idGenerator.getId();
  }

  private get currentId() {
    return this.getProperty("currentId") as number;
  }

  private set currentId(value: number) {
    if (this.currentId === value) {
      return;
    }

    this._setProperty("currentId", value);
  }

  setChanges(changes: IObjectChanges): void {
    super.setChanges(changes);

    const { idGenerator } = getApplicationContextOrThrow();

    idGenerator.setId(this.currentId);
  }
}

registerSerializableClass(IdGeneratorSync);

export { IdGeneratorSync };
