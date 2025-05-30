/* eslint-disable @typescript-eslint/no-require-imports */
import { describe, expect, expectTypeOf, it, test } from 'vitest';
import { z as z3 } from 'zod/v3';
import { z as z4 } from 'zod/v4';

import { isZodTypeLike, isZodV3Type } from '../zod4.js';

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

describe('isZodTypeLike', () => {
  it('should return true for Zod v3 types', () => {
    expect(isZodTypeLike(z3.object({}))).toBe(true);
    expect(isZodTypeLike(z3.number())).toBe(true);
    expect(isZodTypeLike(z3.any())).toBe(true);
  });
  it('should return true for Zod v4 types', () => {
    expect(isZodTypeLike(z4.object({}))).toBe(true);
    expect(isZodTypeLike(z4.number())).toBe(true);
    expect(isZodTypeLike(z4.any())).toBe(true);
  });
  it('should return false for an object without a standard schema', () => {
    expect(isZodTypeLike({})).toBe(false);
  });
  it('should return false for an object with a standard schema, but the incorrect vendor name', () => {
    expect(isZodTypeLike({ '~standard': { vendor: 'DNP' } })).toBe(false);
  });
});

describe('isZodV3Type', () => {
  // since we use require here, the prototype chain in the cjs module will be different than the esm build
  const { z: z3_2 } = require('zod/v3') as typeof import('zod/v3');

  it('should return true for an instance of ZodNumber', () => {
    expect(isZodV3Type(z3.number())).toBe(true);
  });
  it('should return true for an instance of ZodObject', () => {
    expect(isZodV3Type(z3.object({}))).toBe(true);
  });
  it('should return false for null', () => {
    expect(isZodV3Type(null)).toBe(false);
  });
  it('should return false for any empty object', () => {
    expect(isZodV3Type({})).toBe(false);
  });
  it('should return false for an object with a null prototype', () => {
    expect(isZodV3Type(Object.create(null))).toBe(false);
  });
  it('should return true for a ZodObject created in a different context', () => {
    const input = z3_2.object({});
    expect(input).not.toBeInstanceOf(z3.ZodType);
    expect(isZodV3Type(input)).toBe(true);
  });
});
