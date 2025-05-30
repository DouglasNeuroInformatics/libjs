import { ok } from 'neverthrow';
import type { Result } from 'neverthrow';
import { z } from 'zod';

import { ValidationException } from './exception.js';
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

export const $BooleanLike: z.ZodType<boolean, z.ZodTypeDef, any> = z.preprocess((arg) => {
  if (typeof arg === 'string') {
    if (arg.trim().toLowerCase() === 'true') {
      return true;
    } else if (arg.trim().toLowerCase() === 'false') {
      return false;
    }
  }
  return arg;
}, z.boolean());

export const $NumberLike: z.ZodType<number, z.ZodTypeDef, any> = z.preprocess((arg) => {
  if (isNumberLike(arg)) {
    return parseNumber(arg);
  }
  return arg;
}, z.number());

export const $UrlLike: z.ZodType<URL, z.ZodTypeDef, any> = z.preprocess(
  (arg) => {
    if (arg instanceof URL) {
      return arg.href;
    }
    return arg;
  },
  z
    .string()
    .url()
    .transform((arg) => new URL(arg))
);

export const $Uint8ArrayLike: z.ZodType<Uint8Array, z.ZodTypeDef, any> = z
  .union([z.array(z.number().int().min(0).max(255)), z.instanceof(Uint8Array), z.instanceof(ArrayBuffer)])
  .transform((arg) => {
    if (!(arg instanceof Uint8Array)) {
      return new Uint8Array(arg);
    }
    return arg;
  });

export function safeParse<TSchema extends z.ZodTypeAny>(
  data: unknown,
  $Schema: TSchema
): Result<z.infer<TSchema>, typeof ValidationException.Instance> {
  const result = $Schema.safeParse(data);
  if (!result.success) {
    return ValidationException.asErr({
      details: {
        data,
        issues: result.error.issues
      }
    });
  }
  return ok(result.data);
}
