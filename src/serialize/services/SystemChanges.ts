import { ISerializable, IChangeObject, IChanges } from "../serialize.interface";
import { getContext } from "../../context/context";
import { ISystemChanges } from "./services.interface";

export class SystemChanges implements ISystemChanges {
  private _changes = new Map<ISerializable, IChangeObject>();

  setChangeObject(key: ISerializable, changeObject: IChangeObject): void {
    const { objects } = getContext();

    if (!objects.hasObject(key)) {
      changeObject.setAllPropertiesChanged();
    }

    this._changes.set(key, changeObject);
  }

  getChangeObject(key: ISerializable): IChangeObject | undefined {
    return this._changes.get(key);
  }

  clear(): void {
    this._changes.clear();
  }

  getChanges(): IChanges[] {
    const result: IChanges[] = [];

    this._changes.forEach((changeObject, source) => {
      const objChanges = changeObject.getChanges(source);

      if (objChanges) {
        result.push(objChanges);
      }
    });

    return result;
  }
}
