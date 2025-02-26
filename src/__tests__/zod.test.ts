import * as module from 'node:module';

import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { $BooleanLike, $NumberLike, $Uint8ArrayLike, $UrlLike, isZodType, safeParse } from '../zod.js';

const require = module.createRequire(import.meta.url);

/** since we use require here, the prototype chain in the cjs module will be different than the esm build  */
const { z: zCJS } = require('zod') as typeof import('zod');

describe('isZodType', () => {
  it('should return true for an instance of ZodNumber', () => {
    expect(isZodType(z.number())).toBe(true);
  });
  it('should return true for an instance of ZodObject', () => {
    expect(isZodType(z.object({}))).toBe(true);
  });
  it('should return false for null', () => {
    expect(isZodType(null)).toBe(false);
  });
  it('should return false for any empty object', () => {
    expect(isZodType({})).toBe(false);
  });
  it('should return false for an object with a null prototype', () => {
    expect(isZodType(Object.create(null))).toBe(false);
  });
  it('should return true for a ZodObject created in a different context', () => {
    const input = zCJS.object({});
    expect(input).not.toBeInstanceOf(z.ZodType);
    expect(isZodType(input)).toBe(true);
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
    const $IntLike = $NumberLike.pipe(z.number().int());
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

describe('safeParse', () => {
  const $Schema = z.object({ foo: z.enum(['1', '2']).transform(Number) });
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
            code: z.ZodIssueCode.invalid_enum_value,
            path: ['foo']
          })
        ]
      }
    });
  });
});
