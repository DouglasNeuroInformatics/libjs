/* eslint-disable @typescript-eslint/no-require-imports */
import { describe, expect, expectTypeOf, it, test } from 'vitest';
import { z as z3 } from 'zod/v3';
import { z as z4 } from 'zod/v4';

import {
  $$Function,
  $AnyFunction,
  $BooleanLike,
  $NumberLike,
  $Uint8ArrayLike,
  $UrlLike,
  isZodType,
  isZodTypeLike,
  safeParse
} from '../zod.js';

import type {
  ZodErrorLike,
  ZodIssueLike,
  ZodSafeParseErrorLike,
  ZodSafeParseResultLike,
  ZodSafeParseSuccessLike,
  ZodTypeLike
} from '../zod.js';

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

describe('isZodType', () => {
  describe('v3', () => {
    // since we use require here, the prototype chain in the cjs module will be different than the esm build
    const { z: z3_2 } = require('zod/v3') as typeof import('zod/v3');

    it('should return true for an instance of ZodNumber', () => {
      expect(isZodType(z3.number(), { version: 3 })).toBe(true);
    });
    it('should return true for an instance of ZodObject', () => {
      expect(isZodType(z3.object({}), { version: 3 })).toBe(true);
    });
    it('should return false for null', () => {
      expect(isZodType(null, { version: 3 })).toBe(false);
    });
    it('should return false for any empty object', () => {
      expect(isZodType({}, { version: 3 })).toBe(false);
    });
    it('should return false for an object with a null prototype', () => {
      expect(isZodType(Object.create(null), { version: 3 })).toBe(false);
    });
    it('should return false for a Zod v4 object', () => {
      expect(isZodType(z4.object({}), { version: 3 })).toBe(false);
    });
    it('should return true for a ZodObject created in a different context', () => {
      const input = z3_2.object({});
      expect(input).not.toBeInstanceOf(z3.ZodType);
      expect(isZodType(input, { version: 3 })).toBe(true);
    });
  });
  describe('v4', () => {
    it('should return true for an instance of ZodNumber', () => {
      expect(isZodType(z4.number(), { version: 4 })).toBe(true);
    });
    it('should return true for an instance of ZodObject', () => {
      expect(isZodType(z4.object({}), { version: 4 })).toBe(true);
    });
    it('should return false for null', () => {
      expect(isZodType(null, { version: 4 })).toBe(false);
    });
    it('should return false for any empty object', () => {
      expect(isZodType({}, { version: 4 })).toBe(false);
    });
    it('should return false for a Zod v3 object', () => {
      expect(isZodType(z3.object({}), { version: 4 })).toBe(false);
    });
    it('should return true for a ZodObject created in a different context', () => {
      const base = z4.object({});
      const input = {
        _zod: {
          version: structuredClone(base._zod.version)
        },
        '~standard': {
          vendor: base['~standard'].vendor
        }
      };
      expect(input).not.toBeInstanceOf(z4.ZodType);
      expect(isZodType(input, { version: 4 })).toBe(true);
    });
  });
});

describe('$BooleanLike', () => {
  it('should parse "true" correctly', () => {
    expect($BooleanLike.safeParse('true').data).toBe(true);
  });
  it('should parse "false" correctly', () => {
    expect($BooleanLike.safeParse('false').data).toBe(false);
  });
  it('should parse booleans correctly', () => {
    expect($BooleanLike.safeParse(true).data).toBe(true);
    expect($BooleanLike.safeParse(false).data).toBe(false);
  });
  it('should fail to parse undefined', () => {
    expect($BooleanLike.safeParse(undefined).success).toBe(false);
  });
  it('should fail to parse an empty string', () => {
    expect($BooleanLike.safeParse('').success).toBe(false);
  });
  it('should parse undefined, if set to optional', () => {
    const result = $BooleanLike.optional().safeParse(undefined);
    expect(result.success).toBe(true);
    expect(result.data).toBe(undefined);
  });
});

describe('$NumberLike', () => {
  it('should parse a number', () => {
    expect($NumberLike.safeParse(1).data).toBe(1);
  });
  it('should fail to parse non-numbers', () => {
    expect($NumberLike.safeParse(NaN).success).toBe(false);
    expect($NumberLike.safeParse('').success).toBe(false);
  });
  it('should allow restricting the number through a pipe', () => {
    const $IntLike = $NumberLike.pipe(z4.number().int());
    expect($IntLike.safeParse('1.1').success).toBe(false);
    expect($IntLike.safeParse('1').data).toBe(1);
  });
});

describe('$UrlLike', () => {
  it('should parse a url', () => {
    const result = $UrlLike.safeParse(new URL('https://opendatacapture.org'));
    expect(result.success).toBe(true);
    expect(result.data).toBeInstanceOf(URL);
  });
  it('should parse a url string', () => {
    const result = $UrlLike.safeParse('https://opendatacapture.org');
    expect(result.success).toBe(true);
    expect(result.data).toBeInstanceOf(URL);
  });
});

describe('$Uint8ArrayLike', () => {
  it('should pass when given a Uint8Array', () => {
    const input = new Uint8Array([1, 2, 3]);
    const result = $Uint8ArrayLike.parse(input);
    expect(result).toBeInstanceOf(Uint8Array);
    expect([...result]).toEqual([1, 2, 3]);
  });

  it('should convert an array to Uint8Array', () => {
    const input = [4, 5, 6];
    const result = $Uint8ArrayLike.parse(input);
    expect(result).toBeInstanceOf(Uint8Array);
    expect([...result]).toEqual([4, 5, 6]);
  });

  it('should fail to convert an invalid array', () => {
    expect($Uint8ArrayLike.safeParse([-1, 2, 3]).success).toBe(false);
    expect($Uint8ArrayLike.safeParse([1, 2, 256]).success).toBe(false);
    expect($Uint8ArrayLike.safeParse([1, 2, NaN]).success).toBe(false);
  });

  it('should convert an ArrayBuffer to Uint8Array', () => {
    const buffer = new ArrayBuffer(3);
    const view = new Uint8Array(buffer);
    view.set([7, 8, 9]);
    const result = $Uint8ArrayLike.safeParse(buffer);
    expect(result.success).toBe(true);
    expect(result.data).toBeInstanceOf(Uint8Array);
    expect([...result.data!]).toEqual([7, 8, 9]);
  });
});

describe('$AnyFunction', () => {
  it('should be correctly typed', () => {
    expectTypeOf<z4.infer<typeof $AnyFunction>>().toEqualTypeOf<(...args: any[]) => any>();
  });
  it('should fail to validate a non-function', () => {
    expect($AnyFunction.safeParse('').success).toBe(false);
  });
  it('should validate a function', () => {
    expect($AnyFunction.safeParse(safeParse).success).toBe(true);
  });
});

describe('$$Function', () => {
  const $Schema = $$Function({ input: [z4.number(), z4.number()], output: z4.number() });
  it('should be correctly typed', () => {
    expectTypeOf<z4.infer<typeof $Schema>>().toEqualTypeOf<(arg_0: number, arg_1: number) => number>();
  });
  it('should fail to validate a non-function', () => {
    expect($Schema.safeParse('').success).toBe(false);
  });
  it('should return a function that throws when called with the incorrect number of arguments', () => {
    const fn = $Schema.parse((..._args: any[]) => 0) as (...args: any[]) => number;
    expect(() => fn(1)).toThrow();
    expect(() => fn(1, 2, 3)).toThrow();
  });
  it('should return a function that throws when it returns an invalid value', () => {
    const fn = $Schema.parse((..._args: any[]) => 'hello') as (...args: any[]) => any;
    expect(() => fn(1, 2)).toThrow();
  });
  it('should return a function that returns a valid value, when called with valid inputs', () => {
    const fn = $Schema.parse((a: number, b: number) => a + b);
    expect(fn(1, 2)).toBe(3);
  });
});

describe('safeParse', () => {
  const $Schema = z4.object({ foo: z4.enum(['1', '2']).transform(Number) });
  it('should return an Ok result with the parsed data if successful', () => {
    const result = safeParse({ foo: '1' }, $Schema);
    expect(result.isOk() && result.value).toStrictEqual({ foo: 1 });
  });
  it('should return an Err result with the data and validation issues if unsuccessful', () => {
    const result = safeParse({ foo: '0' }, $Schema);
    expect(result.isErr() && result.error).toMatchObject({
      details: {
        data: {
          foo: '0'
        },
        issues: [
          expect.objectContaining({
            code: 'invalid_value',
            path: ['foo']
          })
        ]
      }
    });
  });
});
