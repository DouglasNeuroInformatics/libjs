import { ValueException } from './exception.js';
import { ok } from './vendor/neverthrow.js';

import type { Result } from './vendor/neverthrow.js';

/** Return an array of integers between 0 (inclusive) and `end` (not inclusive) */
export function range(end: number): Result<readonly number[], typeof ValueException.Instance>;

/** Return an array of integers between `start` (inclusive) and `end` (not inclusive) */
export function range(start: number, end: number): Result<readonly number[], typeof ValueException.Instance>;

export function range(...args: number[]): Result<readonly number[], typeof ValueException.Instance> {
  const start = args.length === 2 ? args[0]! : 0;
  const end = args.length === 2 ? args[1]! : args[0]!;

  if (start >= end) {
    return ValueException.asErr(`End of range '${end}' must be greater than start '${start}'`);
  }

  const values: number[] = [];
  for (let i = start; i < end; i++) {
    values.push(i);
  }
  return ok(values);
}
