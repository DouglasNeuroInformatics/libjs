import { z } from 'zod';

import { isNumberLike, parseNumber } from './number.js';
import { isObject } from './object.js';

/** Used to determine if object is of type `ZodType` independent of specific instances or library versions */
export function isZodType(arg: unknown): arg is z.ZodTypeAny {
  let prototype: null | object = null;
  if (isObject(arg) && isObject(arg.constructor)) {
    prototype = Reflect.getPrototypeOf(arg.constructor);
  }
  return Boolean(prototype && Reflect.get(prototype, 'name') === 'ZodType');
}

export const $$BooleanLike = () => {
  return z.preprocess((arg) => {
    if (typeof arg === 'string') {
      if (arg.trim().toLowerCase() === 'true') {
        return true;
      } else if (arg.trim().toLowerCase() === 'false') {
        return false;
      }
    }
    return arg;
  }, z.boolean());
};

export const $$NumberLike = (options?: { int: boolean }) => {
  let schema = z.number();
  if (options?.int) {
    schema = schema.int();
  }
  return z.preprocess((arg) => {
    if (isNumberLike(arg)) {
      return parseNumber(arg);
    }
    return arg;
  }, schema);
};
