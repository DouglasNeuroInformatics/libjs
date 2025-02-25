import { describe, expect, it } from 'vitest';

import { randomDate, randomInt, randomValue } from '../random.js';

describe('randomInt', () => {
  it('should return an integer value within the range', () => {
    const min = 5;
    const max = 8;
    const result = randomInt(min, max)._unsafeUnwrap();
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThan(8);
    expect(Number.isInteger(result)).toBe(true);
  });
  it('should return an error if the min value is larger than the max', () => {
    expect(randomInt(10, 5).isErr()).toBe(true);
  });
  it('should return an error if the min value equals the max', () => {
    expect(randomInt(10, 10).isErr()).toBe(true);
  });
  it('should handle negative values', () => {
    const min = -5;
    const max = -3;
    const result = randomInt(min, max)._unsafeUnwrap();
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThan(8);
    expect(Number.isInteger(result)).toBe(true);
    expect(randomInt(max, min).isErr()).toBe(true);
  });
});

describe('randomDate', () => {
  it('should return a date within the range', () => {
    const start = new Date(2000, 0, 1);
    const end = new Date();
    const random = randomDate(start, end)._unsafeUnwrap();
    expect(random.getTime() >= start.getTime()).toBe(true);
    expect(random.getTime() <= end.getTime()).toBe(true);
  });
  it('should return an error if the end is before the start', () => {
    expect(randomDate(new Date(), new Date(2000, 0, 1)).isErr()).toBe(true);
  });
});

describe('randomValue', () => {
  it('should return an error if given an empty array', () => {
    expect(randomValue([]).isErr()).toBe(true);
  });
  it('should return a value in the array', () => {
    const arr = [-10, -20, -30];
    expect(arr.includes(randomValue(arr)._unsafeUnwrap()));
  });
  it('should not mutate the array', () => {
    const arr = [-10, -20, -30];
    randomValue(arr);
    expect(arr).toMatchObject([-10, -20, -30]);
  });
});
