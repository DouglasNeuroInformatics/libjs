import { describe, expect, it } from 'vitest';

import { hasDuplicates, isUnique } from '../array.js';

describe('isUnique', () => {
  it('should return true for a unique array', () => {
    expect(isUnique([1, 2, 3])).toBe(true);
  });
  it('should return true for an empty array', () => {
    expect(isUnique([])).toBe(true);
  });
  it('should return false for an array with duplicate values', () => {
    expect(isUnique([1, 2, 2])).toBe(false);
  });
});

describe('hasDuplicates', () => {
  it('should return false for a unique array', () => {
    expect(hasDuplicates([1, 2, 3])).toBe(false);
  });
  it('should return false for an empty array', () => {
    expect(hasDuplicates([])).toBe(false);
  });
  it('should return true for an array with duplicate values', () => {
    expect(hasDuplicates([1, 2, 2])).toBe(true);
  });
});
