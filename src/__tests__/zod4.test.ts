import { expectTypeOf, test } from 'vitest';
import type { z as z3 } from 'zod/v3';
import type { z as z4 } from 'zod/v4';

import type {
  ZodErrorLike,
  ZodIssueLike,
  ZodSafeParseErrorLike,
  ZodSafeParseResultLike,
  ZodSafeParseSuccessLike,
  ZodTypeLike
} from '../zod4.js';

test('ZodIssueLike', () => {
  expectTypeOf<z3.ZodIssue>().toMatchTypeOf<ZodIssueLike>();
  expectTypeOf<z4.core.$ZodIssue>().toMatchTypeOf<ZodIssueLike>();
});

test('ZodErrorLike', () => {
  expectTypeOf<z3.ZodError>().toMatchTypeOf<ZodErrorLike>();
  expectTypeOf<z4.core.$ZodError>().toMatchTypeOf<ZodErrorLike>();
});

test('ZodSafeParseSuccessLike', () => {
  expectTypeOf<z3.SafeParseSuccess<number>>().toMatchTypeOf<ZodSafeParseSuccessLike<number>>();
  expectTypeOf<z4.ZodSafeParseSuccess<number>>().toMatchTypeOf<ZodSafeParseSuccessLike<number>>();
});

test('ZodSafeParseErrorLike', () => {
  expectTypeOf<z3.SafeParseError<number>>().toMatchTypeOf<ZodSafeParseErrorLike>();
  expectTypeOf<z4.ZodSafeParseError<number>>().toMatchTypeOf<ZodSafeParseErrorLike>();
});

test('ZodSafeParseResultLike', () => {
  expectTypeOf<z3.SafeParseReturnType<number, number>>().toMatchTypeOf<ZodSafeParseResultLike<number>>();
  expectTypeOf<z4.ZodSafeParseResult<number>>().toMatchTypeOf<ZodSafeParseResultLike<number>>();
});

test('ZodTypeLike', () => {
  expectTypeOf<z3.ZodTypeAny>().toMatchTypeOf<ZodTypeLike<any>>();
  expectTypeOf<z3.ZodTypeAny>().toMatchTypeOf<ZodTypeLike<unknown>>();
  expectTypeOf<z3.ZodNumber>().toMatchTypeOf<ZodTypeLike<unknown>>();
  expectTypeOf<z3.ZodNumber>().toMatchTypeOf<ZodTypeLike<number>>();
  expectTypeOf<z3.ZodNumber>().not.toMatchTypeOf<ZodTypeLike<string>>();
  expectTypeOf<z4.ZodType>().toMatchTypeOf<ZodTypeLike<any>>();
  expectTypeOf<z4.ZodType>().toMatchTypeOf<ZodTypeLike<unknown>>();
  expectTypeOf<z4.ZodNumber>().toMatchTypeOf<ZodTypeLike<unknown>>();
  expectTypeOf<z4.ZodNumber>().toMatchTypeOf<ZodTypeLike<number>>();
  expectTypeOf<z4.ZodNumber>().not.toMatchTypeOf<ZodTypeLike<string>>();
});
