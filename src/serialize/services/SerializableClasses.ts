import { ISerializableClass } from "../serialize.interface";
import { ISerializableClasses } from "./services.interface";

export class SerializableClasses implements ISerializableClasses {
  private _classes: { [key: string]: ISerializableClass } = {};

  addClass(className: string, classObject: ISerializableClass): void {
    if (this._classes[className] !== undefined) {
      throw new Error(`Class with name "${className}" is already added.`);
    }

    this._classes[className] = classObject;
  }

  deleteClass(className: string): void {
    delete this._classes[className];
  }

  clear(): void {
    this._classes = {};
  }
}
