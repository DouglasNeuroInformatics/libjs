import { describe, expect, it } from 'vitest';

import { parseDuration, sleep, toBasicISOString, toLocalISOString, yearsPassed } from './datetime.js';

describe('toLocalISOString', () => {
  it('should convert a UTC date back to a local ISO string', () => {
    const expected = '2025-01-01T00:00:00.000';
    const actual = toLocalISOString(new Date(expected));
    expect(actual).toBe(expected);
  });
});

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

describe('sleep', () => {
  it('should wait for at least the specified time', async () => {
    const start = Date.now();
    await sleep(0.2);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(200);
  });
});

describe('parseDuration', () => {
  it('should fail to parse a negative duration', () => {
    expect(() => parseDuration(-1)).toThrow('Cannot parse negative length of time: -1');
  });
  it('should parse a duration of zero', () => {
    expect(parseDuration(0)).toEqual({
      days: 0,
      hours: 0,
      milliseconds: 0,
      minutes: 0,
      seconds: 0
    });
  });
  it('should parse a duration less than a second', () => {
    expect(parseDuration(50)).toEqual({
      days: 0,
      hours: 0,
      milliseconds: 50,
      minutes: 0,
      seconds: 0
    });
    expect(parseDuration(500)).toEqual({
      days: 0,
      hours: 0,
      milliseconds: 500,
      minutes: 0,
      seconds: 0
    });
  });
  it('should parse a duration less than one minute but more than one second', () => {
    expect(parseDuration(11_100)).toEqual({
      days: 0,
      hours: 0,
      milliseconds: 100,
      minutes: 0,
      seconds: 11
    });
  });
  it('should parse a duration less than one hour but more than one minute', () => {
    expect(parseDuration(60_000)).toEqual({
      days: 0,
      hours: 0,
      milliseconds: 0,
      minutes: 1,
      seconds: 0
    });
    expect(parseDuration(62_500)).toEqual({
      days: 0,
      hours: 0,
      milliseconds: 500,
      minutes: 1,
      seconds: 2
    });
  });

  it('should parse a duration less than one day but more than one hour', () => {
    expect(parseDuration(3_600_000)).toEqual({
      days: 0,
      hours: 1,
      milliseconds: 0,
      minutes: 0,
      seconds: 0
    });
  });
  it('should parse a duration greater than one day', () => {
    expect(parseDuration(86_400_000)).toEqual({
      days: 1,
      hours: 0,
      milliseconds: 0,
      minutes: 0,
      seconds: 0
    });
    expect(parseDuration(4_351_505_030)).toEqual({
      days: 50,
      hours: 8,
      milliseconds: 30,
      minutes: 45,
      seconds: 5
    });
  });
});
