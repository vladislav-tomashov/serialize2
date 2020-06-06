import {
  isSerializable,
  ISerializableClass,
} from "../../serializable-object/interfaces";
import { IClassesRegistry } from "./interfaces";

interface IClassesRegistryMap {
  [key: string]: ISerializableClass<any>;
}

const globalClassRegistry: IClassesRegistryMap = {};

class ClassesRegistry implements IClassesRegistry {
  private _classesRegistry: IClassesRegistryMap = { ...globalClassRegistry };

  add<T>(classObject: ISerializableClass<T>): void {
    const className = classObject.prototype.getClassName();

    if (this._classesRegistry[className] !== undefined) {
      throw new Error(`Class with name "${className}" is already added.`);
    }

    this._classesRegistry[className] = classObject;
  }

  get<T>(className: string): ISerializableClass<T> | undefined {
    return this._classesRegistry[className];
  }

  getOrThrow<T>(className: string): ISerializableClass<T> {
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

const registerSerializableClass = <T>(
  classObject: ISerializableClass<T>,
): void => {
  if (!isSerializable(classObject.prototype)) {
    throw new Error(
      `Class "${classObject.name}" does not implement interface ISerializable.`,
    );
  }

  const className = classObject.prototype.getClassName();

  if (globalClassRegistry[className] !== undefined) {
    throw new Error(
      `Class with name "${className}" is already added to global class registry.`,
    );
  }

  globalClassRegistry[className] = classObject;
};

export { ClassesRegistry, registerSerializableClass };
