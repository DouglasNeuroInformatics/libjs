/** Returns a random integer between `min` (inclusive) and `max` (not inclusive) */
export function randomInt(min: number, max: number) {
  if (min >= max) {
    throw new Error(`Min value '${min}' must not be greater than or equal to the max value '${max}'`);
  }
  return Math.floor(Math.random() * (max - min)) + min;
}

/** Returns a random date between `start` and `end` (both inclusive) */
export function randomDate(start: Date, end: Date) {
  if (start > end) {
    throw new Error(`Start date '${start.toISOString()}' cannot be greater than end date '${end.toISOString()}'`);
  }
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/** Returns a random value from the array */
export function randomValue<T>(arr: T[]) {
  if (arr.length === 0) {
    throw new Error('Cannot select random value from array of length zero');
  }
  return arr[randomInt(0, arr.length)] as T;
}
