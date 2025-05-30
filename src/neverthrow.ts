import type { Result } from 'neverthrow';

export function unwrap<T, E extends Error>(result: Result<T, E>): any {
  if (result.isErr()) {
    throw result.error;
  }
  return result.value;
}
