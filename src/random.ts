import { ok } from 'neverthrow';
import type { Result } from 'neverthrow';

import { ValueException } from './exception.js';

/** Returns a random integer between `min` (inclusive) and `max` (not inclusive) */
export function randomInt(min: number, max: number): Result<number, typeof ValueException.Instance> {
  if (min >= max) {
    return ValueException.asErr(`Min value '${min}' must not be greater than or equal to the max value '${max}'`);
  }
  return ok(Math.floor(Math.random() * (max - min)) + min);
}

/** Returns a random date between `start` and `end` (both inclusive) */
export function randomDate(start: Date, end: Date): Result<Date, typeof ValueException.Instance> {
  if (start > end) {
    return ValueException.asErr(
      `Start date '${start.toISOString()}' cannot be greater than end date '${end.toISOString()}'`
    );
  }
  return ok(new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())));
}

/** Returns a random value from the array */
export function randomValue<T>(arr: T[]): Result<T, typeof ValueException.Instance> {
  if (arr.length === 0) {
    return ValueException.asErr('Cannot select random value from array of length zero');
  }
  return randomInt(0, arr.length).map((index) => arr[index]!);
}
