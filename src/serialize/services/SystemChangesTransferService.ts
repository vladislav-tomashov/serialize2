import {
  ISystemChangesTransferService,
  TranserStatus,
  ITransferResult,
  TranserResultStatus,
} from "./services.interface";

export class SystemChangesTransferService
  implements ISystemChangesTransferService {
  private _id: number = 0;
  private _status: TranserStatus = TranserStatus.Initial;
  private _lastTransterResult = {} as ITransferResult;

  get status() {
    return this._status;
  }

  get result() {
    return this._lastTransterResult;
  }

  async transferChanges(changesAsString: string): Promise<void> {
    if (
      this._status === TranserStatus.Receiving ||
      this._status === TranserStatus.Sending
    ) {
      throw new Error(`Cannot transer changes because service is busy.`);
    }

    this._status = TranserStatus.Sending;
    this._id = this._id + 1;

    this._lastTransterResult = {
      id: this._id,
      startTimestamp: new Date().toISOString(),
      status: TranserResultStatus.Pending,
      changesAsString,
    };

    try {
      // TODO: Send this object over network
      this._lastTransterResult.status = TranserResultStatus.Success;
    } catch (e) {
      this._lastTransterResult.status = TranserResultStatus.Error;
      this._lastTransterResult.error = e;

      throw e;
    } finally {
      this._status = TranserStatus.Sent;
      this._lastTransterResult.endTimestamp = new Date().toISOString();
    }
  }

  receiveChanges(id: number, changesAsString: string): any {
    if (
      this._status === TranserStatus.Receiving ||
      this._status === TranserStatus.Sending
    ) {
      throw new Error(`Cannot transer changes because service is busy.`);
    }

    try {
      this._lastTransterResult = {
        id,
        startTimestamp: new Date().toISOString(),
        status: TranserResultStatus.Pending,
        changesAsString,
      };

      this._status = TranserStatus.Receiving;

      if (id <= this._id) {
        throw new Error(
          `Cannot receive changes because current system state is newer.`
        );
      }

      this._id = id;

      const result = JSON.parse(changesAsString);
      this._lastTransterResult.status = TranserResultStatus.Success;

      return result;
    } catch (e) {
      this._lastTransterResult.status = TranserResultStatus.Error;
      this._lastTransterResult.error = e;

      throw e;
    } finally {
      this._lastTransterResult.endTimestamp = new Date().toISOString();
      this._status = TranserStatus.Received;
    }
  }
}
