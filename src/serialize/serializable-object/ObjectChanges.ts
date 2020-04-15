import { IGetProperty } from "./serializable-object.interface";
import { TPropertyChange } from "../serialize.interface";

export class ObjectChanges<T, K extends keyof T> {
  private _log = new Set<K>();

  private _disabled = false;

  get hasEnries() {
    return this._log.size > 0;
  }

  registerPropertyUpdate(prop: K) {
    this._log.add(prop);
  }

  getChanges(source: IGetProperty<T, K>): TPropertyChange<any>[] {
    const result = Array.from(this._log).map(
      (x) => [x, source.getProperty(x)] as TPropertyChange<any>
    );

    return result;
  }

  isPropertyChanged(property: K): boolean {
    return this._log.has(property);
  }

  clear() {
    if (this._log.size > 0) {
      this._log.clear();
    }
  }
}
