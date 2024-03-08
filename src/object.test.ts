import { describe, expect, it } from 'vitest';

import { deepFreeze } from './object.js';

describe('deepFreeze', () => {
  it('should not allow mutating a primitive value', () => {
    const obj = deepFreeze({ foo: 1 });
    expect(() => {
      // @ts-expect-error - check runtime behavior
      obj.foo = 2;
    }).toThrow();
  });
  it('should not allow mutating a nested object', () => {
    const obj = deepFreeze({ foo: { bar: 1 } });
    expect(() => {
      // @ts-expect-error - check runtime behavior
      obj.foo.bar = 2;
    }).toThrow();
  });
  it('should not allow mutating a deeply nested array', () => {
    const obj = deepFreeze({ foo: { bar: [1, 2, 3] } });
    expect(() => {
      // @ts-expect-error - check runtime behavior
      obj.foo.bar[0] = 2;
    }).toThrow();
  });
});
