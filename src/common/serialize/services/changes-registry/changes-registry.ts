import { IChangesRegistry } from "./interfaces";
import { ISerializable, IChanges } from "../../serializable-object/interfaces";

export class ChangesRegistry implements IChangesRegistry {
  private _changes = new Set<ISerializable<any>>();

  add<T>(serializable: ISerializable<T>): void {
    this._changes.add(serializable);
  }

  has<T>(serializable: ISerializable<T>): boolean {
    return this._changes.has(serializable);
  }

  clear(): void {
    this._changes.clear();
  }

  isEmpty(): boolean {
    return this._changes.size === 0;
  }

  getChangesAsJson(): IChanges[] {
    const result: IChanges[] = [];

    this._changes.forEach((serializable) => {
      const changes = serializable.getChanges();

      if (changes) {
        result.push(changes);
      }
    });

    return result;
  }
}
