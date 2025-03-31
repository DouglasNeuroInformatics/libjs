import { Result, ResultAsync } from './vendor/neverthrow.js';

export function asyncResultify<T, E>(fn: () => Promise<Result<T, E>>): ResultAsync<T, E> {
  return new ResultAsync(fn());
}
