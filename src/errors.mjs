// @format
//
// Sources becoming inspired about finding appropriate error names:
//
// - https://docs.python.org/3/library/exceptions.html
//

export class NotImplementedError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotImplementedError);
    }

    this.name = "NotImplementedError";
  }
}

export class ValidationError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }

    this.name = "ValidationError";
  }
}
