import { err, ok } from 'neverthrow';
import { describe, expect, it } from 'vitest';

import { unwrap } from '../neverthrow.js';

describe('unwrap', () => {
  it('should throw if the result is an Error', () => {
    const error = new Error('Something went wrong!');
    expect(() => unwrap(err(error))).toThrow(error);
  });
  it('should return if the result is Ok', () => {
    expect(unwrap(ok(5))).toBe(5);
  });
});
