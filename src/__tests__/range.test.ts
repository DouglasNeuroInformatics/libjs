import { describe, expect, it } from 'vitest';

import { range } from '../range.js';

describe('range', () => {
  it('should return an array equal in length to the range', () => {
    const arr = range(10);
    expect(arr.length).toBe(10);
  });
  it('should throw an error if the start is equal to the end', () => {
    expect(() => range(1, 1)).toThrow();
  });
});
