export type ReadonlyDeep<T extends object> = Readonly<{
  [K in keyof T]: T[K] extends object ? ReadonlyDeep<T[K]> : T[K];
}>;

export function deepFreeze<T extends object>(obj: T): ReadonlyDeep<T> {
  Object.keys(obj).forEach((key) => {
    const value: unknown = obj[key as keyof T];
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  });
  return Object.freeze(obj);
}
