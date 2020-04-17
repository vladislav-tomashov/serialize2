import { IGetProperty, TKeyValuePair } from "../serialize.interface";

export class ObjectChanges<T, K extends keyof T> {
  private _log = new Set<K>();
  private _disabled = false;

  get disabled() {
    return this._disabled;
  }

  enable(): void {
    if (!this._disabled) {
      return;
    }

    this._disabled = false;
  }

  disable(): void {
    if (this._disabled) {
      return;
    }

    this._disabled = true;
    this.clear();
  }

  setPropertyChanged(prop: K, value: T[K]) {
    if (this._disabled) {
      return;
    }

    this._log.add(prop);
  }

  getChanges(source: IGetProperty<T, K>): TKeyValuePair<T, K>[] {
    return Array.from(this._log).map(
      (prop) => [prop, source.getProperty(prop)] as TKeyValuePair<T, K>
    );
  }

  clear() {
    if (this._log.size > 0) {
      this._log.clear();
    }
  }
}
