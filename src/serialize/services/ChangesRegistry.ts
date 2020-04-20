import { ISerializable, IChangeObject, IChanges } from "../serialize.interface";
import { IChangesRegistry } from "./services.interface";

export class ChangesRegistry implements IChangesRegistry {
  private _changes = new Map<
    ISerializable<any, any>,
    IChangeObject<any, any>
  >();

  set(
    key: ISerializable<any, any>,
    changeObject: IChangeObject<any, any>
  ): void {
    this._changes.set(key, changeObject);
  }

  get(key: ISerializable<any, any>): IChangeObject<any, any> | undefined {
    return this._changes.get(key);
  }

  clear(): void {
    this._changes.clear();
  }

  getChangesAsJson(): IChanges[] {
    const result: IChanges[] = [];

    this._changes.forEach((changeObject, source) => {
      const changes = changeObject.getChanges(source);

      if (changes) {
        result.push(changes);
      }
    });

    return result;
  }
}
