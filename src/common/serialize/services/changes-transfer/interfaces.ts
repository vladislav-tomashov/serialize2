import { TranserResultStatus } from "./transfer-result-status";
import { TranserStatus } from "./transfer-status";

export interface ITransferResult {
  status: TranserResultStatus;
  error?: any;
  id: number;
  changesAsString: string;
  startTimestamp: string;
  endTimestamp?: string;
}

export interface IChangesTransferService {
  readonly status: TranserStatus;

  readonly result: ITransferResult;

  transferChanges(changesAsString: string): void;

  receiveChanges(transferId: number, changesAsString: string): any;
}
