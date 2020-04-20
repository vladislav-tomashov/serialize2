import {
  IChangesTransferService,
  TranserStatus,
  ITransferResult,
  TranserResultStatus,
} from "./services.interface";

export class ChangesTransferService implements IChangesTransferService {
  private _id: number = 0;
  private _status: TranserStatus = TranserStatus.Initial;
  private _result = {} as ITransferResult;

  get status() {
    return this._status;
  }

  get result() {
    return this._result;
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

    this._result = {
      id: this._id,
      startTimestamp: new Date().toISOString(),
      status: TranserResultStatus.Pending,
      changesAsString,
    };

    try {
      // TODO: Send this object over network
      this._result.status = TranserResultStatus.Success;
    } catch (e) {
      this._result.status = TranserResultStatus.Error;
      this._result.error = e;

      throw e;
    } finally {
      this._status = TranserStatus.Sent;
      this._result.endTimestamp = new Date().toISOString();
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
      this._result = {
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
      this._result.status = TranserResultStatus.Success;

      return result;
    } catch (e) {
      this._result.status = TranserResultStatus.Error;
      this._result.error = e;

      throw e;
    } finally {
      this._result.endTimestamp = new Date().toISOString();
      this._status = TranserStatus.Received;
    }
  }
}
