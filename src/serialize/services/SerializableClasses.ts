import { ISerializableClass } from "../serialize.interface";

export class SerializableClasses {
  private _classes: { [key: string]: ISerializableClass<any> } = {};

  addClass(className: string, classObject: ISerializableClass<any>): void {
    if (this._classes[className] !== undefined) {
      throw new Error(
        `SerializeService.registerSerializableClass(): Class with name "${className}" is already registered`
      );
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
