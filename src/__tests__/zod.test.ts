import * as module from 'node:module';

import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { $BooleanLike, $NumberLike, isZodType } from '../zod.js';

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
