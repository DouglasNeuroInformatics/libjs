import { expectTypeOf, test } from 'vitest';

import type { IsUnion, SingleKeyMap, ToAbstractConstructor } from '../types.js';

test('ToAbstractConstructor', () => {
  expectTypeOf<ToAbstractConstructor<new () => { foo: string }>>().toEqualTypeOf<abstract new () => { foo: string }>();
});

test('IsUnion', () => {
  expectTypeOf<IsUnion<string>>().toEqualTypeOf<false>();
  expectTypeOf<IsUnion<number | string>>().toEqualTypeOf<true>();
  expectTypeOf<IsUnion<1 | 2>>().toEqualTypeOf<true>();
  expectTypeOf<IsUnion<1>>().toEqualTypeOf<false>();
  expectTypeOf<IsUnion<'bar' | 'foo'>>().toEqualTypeOf<true>();
  expectTypeOf<IsUnion<'foo'>>().toEqualTypeOf<false>();
});

test('SingleKeyMap', () => {
  expectTypeOf<SingleKeyMap<string, number>>().toBeNever();
  expectTypeOf<SingleKeyMap<'bar' | 'foo', number>>().toBeNever();
  expectTypeOf<SingleKeyMap<'foo', number>>().toEqualTypeOf<{ foo: number }>();
});
