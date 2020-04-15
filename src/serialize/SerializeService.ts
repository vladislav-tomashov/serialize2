export interface ISerializableState {
  className: string;
}

export interface ISerializable {
  serializable: true;
  readonly id: string;
  getState: () => ISerializableState;
  setState: (state: ISerializableState) => void;
}

function isSerializable(value: any): value is ISerializable {
  return typeof value === "object" && !!value.serializable;
}

export interface ISerializableClass {
  prototype: ISerializable;
}

export class SerializeService {
  private _classes: { [key: string]: ISerializableClass } = {};
  private _objects: { [key: string]: ISerializable } = {};

  registerSerializableClass(className: string, fun: ISerializableClass) {
    if (this._classes[className] !== undefined) {
      throw new Error(
        `SerializeService.registerSerializableClass(): Class with name "${className}" is already registered`
      );
    }

    this._classes[className] = fun;
  }

  registerSerializableObject(obj: ISerializable) {
    if (!isSerializable(obj)) {
      throw new Error(
        `Object does not implement interface ISerializable: ${obj}`
      );
    }

    if (this._objects[obj.id] !== undefined) {
      throw new Error(
        `SerializeService.registerSerializableObject(): Object with id "${obj.id}" is already registered`
      );
    }

    this._objects[obj.id] = obj;
  }

  registerSerializableCollection(arr: ISerializable[]) {
    arr.forEach((obj) => this.registerSerializableObject(obj));
  }
}
