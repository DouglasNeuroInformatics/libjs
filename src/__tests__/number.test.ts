import { describe, expect, it } from 'vitest';

import { formatByteSize, isNumberLike, parseNumber } from '../number.js';

const NUMBER_LIKE_VALUES = [
  5e3,
  0xff,
  -0.1,
  -0,
  0.0,
  +0,
  3.14,
  '5e3',
  '5e+3',
  '-0.1',
  '-0',
  '0.0',
  '+0',
  '3.14',
  '1.',
  '.1',
  Number.MAX_VALUE,
  Number.MIN_VALUE,
  Infinity,
  -Infinity,
  'Infinity',
  '  +Infinity',
  '  -Infinity  '
];

const NON_NUMBER_LIKE_VALUES = [
  '1..',
  '--5',
  'A5',
  '5A',
  NaN,
  null,
  undefined,
  '',
  '   ',
  'foo',
  [1],
  {},
  'NaN',
  'infinity',
  '--Infinity',
  '++Infinity'
];

describe('isNumberLike', () => {
  it('should return true for number-like values', () => {
    NUMBER_LIKE_VALUES.forEach((value) => {
      expect(isNumberLike(value)).toBe(true);
    });
  });
  it('should return false for non-number-like values', () => {
    NON_NUMBER_LIKE_VALUES.forEach((value) => {
      expect(isNumberLike(value)).toBe(false);
    });
  });
});

describe('parseNumber', () => {
  it('should parse numbers', () => {
    NUMBER_LIKE_VALUES.forEach((value) => {
      expect(Number.isNaN(parseNumber(value))).toBe(false);
    });
  });
  it('should return NaN for non-numbers', () => {
    NON_NUMBER_LIKE_VALUES.forEach((value) => {
      expect(Number.isNaN(parseNumber(value))).toBe(true);
    });
  });
});

describe('formatByteSize', () => {
  it('should return bytes for values less than threshold (SI)', () => {
    expect(formatByteSize(999, true)).toBe('999 B');
  });
  it('should return bytes for values less than threshold (Binary)', () => {
    expect(formatByteSize(1023)).toBe('1023 B');
  });

  it('should format 1 KB correctly (SI)', () => {
    expect(formatByteSize(1000, true)).toBe('1.0 KB');
  });

  it('should format 1 KiB correctly (Binary)', () => {
    expect(formatByteSize(1024)).toBe('1.0 KiB');
  });

  it('should format MB correctly with default dp (SI)', () => {
    expect(formatByteSize(1_500_000, true)).toBe('1.5 MB');
  });

  it('should format MiB correctly with default dp (Binary)', () => {
    expect(formatByteSize(1_572_864)).toBe('1.5 MiB'); // 1024 * 1024 * 1.5
  });

  it('should format GB correctly with custom dp (SI)', () => {
    expect(formatByteSize(3_000_000_000, true, 2)).toBe('3.00 GB');
  });

  it('should format GiB correctly with custom dp (Binary)', () => {
    expect(formatByteSize(3_221_225_472, false, 3)).toBe('3.000 GiB'); // 1024^3 * 3
  });

  it('should handle zero bytes', () => {
    expect(formatByteSize(0)).toBe('0 B');
  });

  it('should handle negative values', () => {
    expect(formatByteSize(-1024)).toBe('-1.0 KiB');
  });

  it('should not exceed the unit array length', () => {
    const large = 10 ** 30; // Very large number
    const result = formatByteSize(large, true);
    expect(result.endsWith('YB')).toBe(true); // YB is the last SI unit
  });

  it('should round correctly with dp = 0', () => {
    expect(formatByteSize(1536, false, 0)).toBe('2 KiB'); // 1536 / 1024 = 1.5 → rounded to 2
  });
});
