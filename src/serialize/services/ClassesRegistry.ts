import { ISerializableClass } from "../serialize.interface";
import { IClassesRegistry } from "./services.interface";

export class ClassesRegistry implements IClassesRegistry {
  private _classes: { [key: string]: ISerializableClass<any, any> } = {};

  add(className: string, classObject: ISerializableClass<any, any>): void {
    if (this._classes[className] !== undefined) {
      throw new Error(`Class with name "${className}" is already added.`);
    }

    this._classes[className] = classObject;
  }

  get(className: string): ISerializableClass<any, any> | undefined {
    return this._classes[className];
  }

  getOrThrow(className: string): ISerializableClass<any, any> {
    const result = this._classes[className];

    if (!result) {
      throw new Error(`Class with name="${className}" is not found`);
    }

    return result;
  }

  clear(): void {
    this._classes = {};
  }
}
