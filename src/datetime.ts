export type Duration = {
  days: number;
  hours: number;
  milliseconds: number;
  minutes: number;
  seconds: number;
};

/** A map that associates time units with their corresponding values in milliseconds */
export const TIME_MAP = new Map([
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000],
  ['second', 1000],
  ['millisecond', 1]
] as const);

/**
 * Returns the data in basic ISO format, e.g., yyyy-mm-dd
 * @example
 * ```ts
 * // returns '2000-01-01'
 * toBasicISOString(new Date(2000, 0, 1))
 * ```
 */
export function toBasicISOString(date: Date): string {
  return date.toISOString().split('T')[0]!;
}

/**
 * Returns the number of years since `date`, rounded down
 * @example
 * ```ts
 * const today = new Date();
 * const date = new Date(today.setMonth(today.getMonth() - 18));
 * yearsPassed(date); // 1
 * ```
 */
export function yearsPassed(date: Date): number {
  return new Date(Date.now() - date.getTime()).getFullYear() - 1970;
}

/**
 * Pause the flow of execution in an async function
 *  * @example
 * ```ts
 * await sleep(5);
 * ```
 */
export async function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

/**
 * Parses a given duration in milliseconds into an object representing the duration in days, hours, minutes, seconds, and milliseconds.
 *
 * @param milliseconds - The duration in milliseconds to be parsed.
 * @returns An object of type `Duration` representing the parsed duration.
 * @throws Will throw an error if the input duration is negative.
 */
export function parseDuration(milliseconds: number): Duration {
  if (0 > milliseconds) {
    throw new Error(`Cannot parse negative length of time: ${milliseconds}`);
  }
  const duration: Partial<Duration> = {};
  let remaining = milliseconds;
  TIME_MAP.forEach((value, unit) => {
    const count = Math.floor(remaining / value);
    duration[`${unit}s`] = count;
    remaining %= value;
  });
  return duration as Duration;
}
