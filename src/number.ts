/** Returns `true` if the value is a string representation of a number */
export function isStringNumber(value: string): boolean {
  if (value.trim() !== '') {
    return !Number.isNaN(+value);
  }
  return false;
}

/** Returns `true` if the value is a number or string representation of a number */
export function isNumberLike(value: unknown): value is number | string {
  if (typeof value === 'number') {
    return !Number.isNaN(value);
  } else if (typeof value === 'string') {
    return isStringNumber(value);
  }
  return false;
}

/** Returns `value` as a number if it is a number or string representation of a number, otherwise returns `NaN` */
export function parseNumber(value: unknown): number {
  return isNumberLike(value) ? Number(value) : NaN;
}

export function formatByteSize(bytes: number, si = false, dp = 1): string {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return bytes.toFixed(dp) + ' ' + units[u];
}
