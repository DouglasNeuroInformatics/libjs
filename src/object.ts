export type ReadonlyDeep<T extends object> = Readonly<{
  [K in keyof T]: T[K] extends object ? ReadonlyDeep<T[K]> : T[K];
}>;

export function deepFreeze<T extends object, TReadonly extends boolean = true>(
  obj: T,
  options?: { readonlyType: TReadonly }
): TReadonly extends true ? ReadonlyDeep<T> : T {
  Object.keys(obj).forEach((key) => {
    const value: unknown = obj[key as keyof T];
    if (value && typeof value === 'object') {
      deepFreeze(value, options);
    }
  });
  return Object.freeze(obj);
}

/**
 * Checks if `value` is the [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 */
export function isObject(value: unknown): value is object {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 */
export function isObjectLike(value: unknown): value is object {
  return value !== null && typeof value === 'object';
}

/**
 * Checks if `value` is a plain object. An object is plain if it is created by either
 * `{}`, `new Object()`, or `Object.create(null)`.
 */
export function isPlainObject(value: unknown): value is { [key: string]: unknown } {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const prototype: unknown = Object.getPrototypeOf(value);
  return (
    (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) &&
    !(Symbol.toStringTag in value) &&
    !(Symbol.iterator in value)
  );
}

export function isAllUndefined<T extends { [key: string]: unknown }>(obj: T) {
  return Object.values(obj).every((value) => value === undefined);
}
