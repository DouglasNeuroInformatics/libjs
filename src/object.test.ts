import { describe, expect, it } from 'vitest';

import { deepFreeze, isAllUndefined, isObject, isObjectLike, isPlainObject } from './object.js';

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

describe('isObject', () => {
  it('should return true for an object literal', () => {
    expect(isObject({})).toBe(true);
  });
  it('should return true for an array', () => {
    expect(isObject([])).toBe(true);
  });
  it('should return true for a function', () => {
    expect(isObject(() => null)).toBe(true);
  });
  it('should return false for null', () => {
    expect(isObject(null)).toBe(false);
  });
});

describe('isObjectLike', () => {
  it('should return true for an object literal', () => {
    expect(isObjectLike({})).toBe(true);
  });
  it('should return true for an array', () => {
    expect(isObjectLike([])).toBe(true);
  });
  it('should return false for a function', () => {
    expect(isObjectLike(() => null)).toBe(false);
  });
  it('should return false for null', () => {
    expect(isObjectLike(() => null)).toBe(false);
  });
});

describe('isPlainObject', () => {
  it('should return true for an object literal', () => {
    expect(isPlainObject({ foo: null })).toBe(true);
  });
  it('should return true for an object created with the Object constructor', () => {
    expect(isPlainObject(new Object())).toBe(true);
  });
  it('should return true for an object with a null prototype', () => {
    expect(isPlainObject(Object.create(null))).toBe(true);
  });
  it('should return false for an array', () => {
    expect(isPlainObject([])).toBe(false);
  });
  it('should return false for a function', () => {
    expect(isPlainObject(() => null)).toBe(false);
  });
  it('should return false for null', () => {
    expect(isPlainObject(() => null)).toBe(false);
  });
});

describe('isAllUndefined', () => {
  it('should return true for an empty object', () => {
    expect(isAllUndefined({})).toBe(true);
  });
  it('should return true for an object with an undefined property', () => {
    expect(isAllUndefined({ foo: undefined })).toBe(true);
  });
  it('should return true for an object with a defined property', () => {
    expect(isAllUndefined({ bar: null, foo: undefined })).toBe(false);
  });
});
