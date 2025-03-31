/* eslint-disable @typescript-eslint/only-throw-error */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */

import { Err, Ok, Result } from 'neverthrow';

declare module 'neverthrow' {
  interface Err<T, E> {
    unwrap(): T;
  }
  interface Ok<T, E> {
    unwrap(): T;
  }
}

function unwrap<T, E>(this: Result<T, E>): any {
  if (this.isErr()) {
    throw this.error;
  }
  return this.value;
}

Err.prototype.unwrap = unwrap;
Ok.prototype.unwrap = unwrap;

export { Err, Ok };

export {
  err,
  errAsync,
  fromAsyncThrowable,
  fromPromise,
  fromSafePromise,
  fromThrowable,
  ok,
  okAsync,
  Result,
  ResultAsync,
  safeTry
} from 'neverthrow';
