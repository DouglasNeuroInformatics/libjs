import * as module from 'node:module';

import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { isZodType } from '../zod.js';

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
