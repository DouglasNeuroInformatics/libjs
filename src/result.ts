import { Result, ResultAsync } from 'neverthrow';

export function asyncResultify<T, E>(fn: () => Promise<Result<T, E>>): ResultAsync<T, E> {
  return new ResultAsync(fn());
}

export function unwrap<T, E extends Error>(result: Result<T, E>): T {
  if (result.isErr()) {
    throw result.error;
  }
  return result.value;
}
