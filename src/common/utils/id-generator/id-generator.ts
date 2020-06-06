import { IIdGenerator } from "./interfaces";

export class IdGenerator implements IIdGenerator {
  private _id = 0;

  nextId(): string {
    this._id += 1;

    return `${this._id}`;
  }

  getId(): number {
    return this._id;
  }

  setId(value: number): void {
    if (value < this._id) {
      throw new Error(
        `New value ${value} cannot be less then current value "${this._id}"`,
      );
    }

    this._id = value;
  }
}
