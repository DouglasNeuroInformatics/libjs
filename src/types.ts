import type { IfNever } from 'type-fest';

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
export type HasNestedKey<T, P extends string> = T extends { [key: string]: unknown }
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
