import { describe, expect, it } from 'vitest';

import { range } from '../range.js';

describe('range', () => {
  it('should return an array equal in length to the range', () => {
    const arr = range(10)._unsafeUnwrap();
    expect(arr.length).toBe(10);
  });
  it('should return an error if the start is equal to the end', () => {
    expect(range(1, 1).isErr()).toBe(true);
  });
});
