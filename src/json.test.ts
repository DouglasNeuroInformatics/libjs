import { describe, expect, it } from 'vitest';

import { replacer, reviver } from './json.js';

describe('replacer', () => {
  it('should serialize a Set', () => {
    const set = new Set([1, 2, 3]);
    expect(replacer('', set)).toEqual({
      __deserializedType: 'Set',
      __isSerializedType: true,
      value: [1, 2, 3]
    });
  });
  it('should return the value if it is not a Set', () => {
    const obj = { a: 1 };
    expect(replacer('', obj)).toBe(obj);
  });
});

describe('reviver', () => {
  it('should deserialize a serialized set', () => {
    const serializedSet = {
      __deserializedType: 'Set',
      __isSerializedType: true,
      value: [1, 2, 3]
    };
    const deserializedSet = new Set([1, 2, 3]);
    expect(reviver('', serializedSet)).toEqual(deserializedSet);
  });
  it('should return the value if it is not a plain object', () => {
    const obj = new Date();
    expect(reviver('', obj)).toBe(obj);
  });
  it('should return the value if it is a plain object but not a serialized set', () => {
    const obj = { a: 1 };
    expect(reviver('', obj)).toBe(obj);
  });
});
