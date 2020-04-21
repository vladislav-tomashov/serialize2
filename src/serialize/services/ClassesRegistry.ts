import { ISerializableClass, isSerializable } from "../serialize.interface";
import { IClassesRegistry } from "./services.interface";

interface IClassesRegistryMap {
  [key: string]: ISerializableClass<any, any>;
}

const globalClassRegistry: IClassesRegistryMap = {};

class ClassesRegistry implements IClassesRegistry {
  private _classesRegistry: IClassesRegistryMap = { ...globalClassRegistry };

  add(classObject: ISerializableClass<any, any>): void {
    const className = classObject.prototype.getClassName();

    if (this._classesRegistry[className] !== undefined) {
      throw new Error(`Class with name "${className}" is already added.`);
    }

    this._classesRegistry[className] = classObject;
  }

  get(className: string): ISerializableClass<any, any> | undefined {
    return this._classesRegistry[className];
  }

  getOrThrow(className: string): ISerializableClass<any, any> {
    const result = this._classesRegistry[className];

    if (!result) {
      throw new Error(`Class with name="${className}" is not found`);
    }

    return result;
  }

  clear(): void {
    this._classesRegistry = {};
  }
}

const registerClass = (classObject: ISerializableClass<any, any>): void => {
  if (!isSerializable(classObject.prototype)) {
    throw new Error(
      `Class "${classObject.name}" does not implement interface ISerializable.`
    );
  }

  const className = classObject.prototype.getClassName();

  if (globalClassRegistry[className] !== undefined) {
    throw new Error(
      `Class with name "${className}" is already added to global class registry.`
    );
  }

  globalClassRegistry[className] = classObject;
};

export { ClassesRegistry, registerClass };
