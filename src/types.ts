import type { IfNever, IsStringLiteral } from 'type-fest';

/**
 * Return whether `T` or any record nested therein contains the key `K`
 *
 * @example
 * HasNestedKey<{ a: string; b: { c: { d: number }[] } }, 'a'>; // true
 * HasNestedKey<{ a: string; b: { c: { d: number }[] } }, 'b'>; // true
 * HasNestedKey<{ a: string; b: { c: { d: number }[] } }, 'c'>; // true
 * HasNestedKey<{ a: string; b: { c: { d: number }[] } }, 'd'>; // true
 * HasNestedKey<{ a: string; b: { c: { d: number }[] } }, 'e'>; // false
 * HasNestedKey<{ a: string; b: { c: { d: number }[] } }, 'd' | 'e'>; // true
 * HasNestedKey<{ a: string; b: { c: { d: number }[] } }, string>; // true
 */
export type HasNestedKey<T, P extends string> = T extends {
  [key: string]: unknown;
}
  ? IfNever<
      keyof {
        [K in keyof T as K extends P ? K : HasNestedKey<T[K], P> extends true ? K : never]: never;
      },
      false,
      true
    >
  : T extends (infer U)[]
    ? HasNestedKey<U, P>
    : false;

export type ToAbstractConstructor<T extends new (...args: any[]) => any> = T extends new (
  ...args: infer TArgs extends any[]
) => infer TReturn
  ? abstract new (...args: TArgs) => TReturn
  : never;

export type IsUnion<T, U = T> = (T extends U ? (U extends T ? true : false) : never) extends true ? false : true;

export type SingleKeyMap<K extends PropertyKey, V> =
  IsStringLiteral<K> extends true
    ? IsUnion<K> extends false
      ? {
          [key in K]: V;
        }
      : never
    : never;
