import { isPlainObject } from './object.js';

type SerializedObjectType<TName extends string, TValue> = {
  __deserializedType: TName;
  __isSerializedType: true;
  value: TValue;
};

type SerializedDate = SerializedObjectType<'Date', string>;

type SerializedSet = SerializedObjectType<'Set', any[]>;

type SerializedObject<TName extends string = string> = Extract<
  SerializedDate | SerializedSet,
  { __deserializedType: TName }
>;

type SerializedObjectName = SerializedObject['__deserializedType'];

function isSerializedObject<TName extends SerializedObjectName>(
  value: unknown,
  name: TName
): value is SerializedObject<TName> {
  if (!isPlainObject(value)) {
    return false;
  }
  return Boolean(value.__isSerializedType && value.__deserializedType === name);
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
  if (isSerializedObject(value, 'Set')) {
    return new Set(value.value);
  }
  return value;
}
