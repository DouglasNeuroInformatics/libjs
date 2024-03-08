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
  return new Promise((resolve) => setTimeout(resolve, seconds / 1000));
}
