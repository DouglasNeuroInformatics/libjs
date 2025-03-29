import { Result, ResultAsync } from 'neverthrow';

export function asyncResultify<T, E>(fn: () => Promise<Result<T, E>>): ResultAsync<T, E> {
  return new ResultAsync(fn());
}
