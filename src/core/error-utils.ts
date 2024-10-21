export class CancelledError extends Error {
  constructor() {
    super('Cancelled');
    this.name = 'Cancelled';
  }
}

export class FailedToInsertToDbError extends Error {
  constructor() {
    super('FailedToInsertToDb');
    this.name = 'FailedToInsertToDb';
  }
}

export class DataNotFoundError extends Error {
  constructor() {
    super('DataNotFoundError');
    this.name = 'DataNotFoundError';
  }
}

export function toErrorMessage(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error';
}

export const cancelledError = new CancelledError();
export const failedToInsertToDbError = new FailedToInsertToDbError();
export const dataNotFoundError = new DataNotFoundError();
