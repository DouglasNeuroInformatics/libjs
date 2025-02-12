import { describe, expect, it } from 'vitest';

import { replacer, reviver } from '../json.js';

describe('replacer', () => {
  it('should serialize a Set', () => {
    const set = new Set([1, 2, 3]);
    expect(JSON.parse(JSON.stringify({ set }, replacer))).toMatchObject({
      set: {
        __deserializedType: 'Set',
        __isSerializedType: true,
        value: [1, 2, 3]
      }
    });
  });
  it('should serialize a Date', () => {
    const date = new Date();
    expect(JSON.parse(JSON.stringify({ date }, replacer))).toMatchObject({
      date: {
        __isSerializedType: true
      }
    });
  });
  it('should return the value if it is not a Set or a Date', () => {
    const obj = { a: 1 };
    expect(replacer('', obj)).toBe(obj);
  });
});

describe('reviver', () => {
  it('should deserialize a serialized Set', () => {
    const serializedSet = {
      __deserializedType: 'Set',
      __isSerializedType: true,
      value: [1, 2, 3]
    };
    const deserializedSet = new Set([1, 2, 3]);
    expect(reviver('', serializedSet)).toEqual(deserializedSet);
  });
  it('should deserialize a serialized Date', () => {
    const date = new Date();
    const serializedDate = {
      __deserializedType: 'Date',
      __isSerializedType: true,
      value: date.toJSON()
    };
    expect(reviver('', serializedDate)).toEqual(date);
    expect(JSON.parse(JSON.stringify({ date: serializedDate }), reviver)).toMatchObject({
      date: expect.any(Date)
    });
  });
  it('should return the value if it is not a plain object', () => {
    const obj = new Date();
    expect(reviver('', obj)).toBe(obj);
  });
  it('should return the value if it is a plain object but not a serialized Set or Date', () => {
    const obj = { a: 1 };
    expect(reviver('', obj)).toBe(obj);
  });
});
