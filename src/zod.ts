import { z } from 'zod';

import { isNumberLike, parseNumber } from './number.js';
import { isObject } from './object.js';

type SchemaFactory<TSchema extends z.ZodTypeAny, TInput = any> = () => z.ZodEffects<TSchema, z.TypeOf<TSchema>, TInput>;

/** Used to determine if object is of type `ZodType` independent of specific instances or library versions */
export function isZodType(arg: unknown): arg is z.ZodTypeAny {
  let prototype: null | object = null;
  if (isObject(arg) && isObject(arg.constructor)) {
    prototype = Reflect.getPrototypeOf(arg.constructor);
  }
  return Boolean(prototype && Reflect.get(prototype, 'name') === 'ZodType');
}

export const $$BooleanLike: SchemaFactory<z.ZodBoolean> = () => {
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

export const $$NumberLike: SchemaFactory<z.ZodNumber> = () => {
  return z.preprocess((arg) => {
    if (isNumberLike(arg)) {
      return parseNumber(arg);
    }
    return arg;
  }, z.number());
};
