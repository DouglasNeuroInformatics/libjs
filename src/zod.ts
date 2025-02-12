import { z } from 'zod';

import { isNumberLike, parseNumber } from './number.js';
import { isObject } from './object.js';

const defaultExtend = <TSchema extends z.ZodTypeAny>(schema: TSchema): TSchema => schema;

type SchemaFactory<TSchema extends z.ZodTypeAny, TInput = any> = (
  extend?: (base: TSchema) => TSchema
) => z.ZodEffects<TSchema, z.TypeOf<TSchema>, TInput>;

/** Used to determine if object is of type `ZodType` independent of specific instances or library versions */
export function isZodType(arg: unknown): arg is z.ZodTypeAny {
  let prototype: null | object = null;
  if (isObject(arg) && isObject(arg.constructor)) {
    prototype = Reflect.getPrototypeOf(arg.constructor);
  }
  return Boolean(prototype && Reflect.get(prototype, 'name') === 'ZodType');
}

export const $$BooleanLike: SchemaFactory<z.ZodBoolean> = (extend = defaultExtend) => {
  return z.preprocess((arg) => {
    if (typeof arg === 'string') {
      if (arg.trim().toLowerCase() === 'true') {
        return true;
      } else if (arg.trim().toLowerCase() === 'false') {
        return false;
      }
    }
    return arg;
  }, extend(z.boolean()));
};

export const $$NumberLike: SchemaFactory<z.ZodNumber> = (extend = defaultExtend) => {
  return z.preprocess((arg) => {
    if (isNumberLike(arg)) {
      return parseNumber(arg);
    }
    return arg;
  }, extend(z.number()));
};
