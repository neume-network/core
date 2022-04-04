// @format
export class NotImplementedError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotImplementedError);
    }

    this.name = "NotImplementedError";
  }
}
