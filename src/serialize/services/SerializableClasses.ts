import { ISerializableClass } from "../serialize.interface";

export class SerializableClasses {
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

  clear() {
    this._classes = {};
  }
}
