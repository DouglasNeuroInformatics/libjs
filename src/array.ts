/**
 * Return whether all items in the array are unique
 */
export function isUnique(arr: unknown[]): boolean {
  return new Set(arr).size === arr.length;
}

/**
 * Return whether the array contains duplicate values
 */
export function hasDuplicates(arr: unknown[]): boolean {
  return !isUnique(arr);
}
