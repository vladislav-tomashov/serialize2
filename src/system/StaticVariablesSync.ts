import { registerClass } from "../serialize/services/ClassesRegistry";
import { BaseSerializable } from "../serialize/serializable-object/BaseSerializable";
import {
  IBaseState,
  IObjectChanges,
} from "../serialize/serializable-object/serializable-object.interface";
import { setId } from "../serialize/utils/id-utils";

export interface IStaticVariablesSyncState extends IBaseState {
  idCounter: number;
}

export type IStaticVariablesSyncStateKey = keyof IStaticVariablesSyncState;

class StaticVariablesSync extends BaseSerializable<
  IStaticVariablesSyncState,
  IStaticVariablesSyncStateKey
> {
  // Proxied state properties
  get idCounter() {
    return this.getProperty("idCounter") as number;
  }

  set idCounter(value: number) {
    this._setProperty("idCounter", value);
  }

  applyChanges(changes: IObjectChanges): void {
    super.applyChanges(changes);

    setId(this.idCounter);
  }
}

registerClass("StaticVariablesSync", StaticVariablesSync);

export { StaticVariablesSync };
