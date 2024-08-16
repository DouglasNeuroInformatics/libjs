import { isPlainObject } from './object.js';

type SerializedSet = {
  __deserializedType: 'Set';
  __isSerializedType: boolean;
  value: any[];
};

function isSerializedSet(value: unknown): value is SerializedSet {
  if (!isPlainObject(value)) {
    return false;
  }
  return Boolean(value.__isSerializedType && value.__deserializedType === 'Set');
}

export function replacer(_: string, value: unknown) {
  if (value instanceof Set) {
    return {
      __deserializedType: 'Set',
      __isSerializedType: true,
      value: Array.from(value)
    } satisfies SerializedSet;
  }
  return value;
}

export function reviver(_: string, value: unknown) {
  if (isSerializedSet(value)) {
    return new Set(value.value);
  }
  return value;
}
