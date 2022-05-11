// @format
//
// Sources becoming inspired about finding appropriate error names:
//
// - https://docs.python.org/3/library/exceptions.html
//
export class NotFoundError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }

    this.name = "NotFoundError";
  }
}
