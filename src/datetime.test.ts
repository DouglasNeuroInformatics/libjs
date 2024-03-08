import { describe, expect, it } from 'vitest';

import { toBasicISOString, yearsPassed } from './datetime.js';

describe('toBasicISOString', () => {
  it('should return a string of the format yyyy-mm-dd', () => {
    expect(toBasicISOString(new Date(2000, 0, 1))).toBe('2000-01-01');
  });
});

describe('yearsPassed', () => {
  it('should return zero for the date eleven months ago', () => {
    const today = new Date();
    const date = new Date(today.setMonth(today.getMonth() - 11));
    expect(yearsPassed(date)).toBe(0);
  });
  it('should return one for the date eighteen months ago', () => {
    const today = new Date();
    const date = new Date(today.setMonth(today.getMonth() - 18));
    expect(yearsPassed(date)).toBe(1);
  });
});
