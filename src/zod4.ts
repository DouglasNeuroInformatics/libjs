import type { z as z3 } from 'zod/v3';

import { isObject, isObjectLike, isPlainObject } from './object.js';

export type ZodIssueLike = {
  [key: string]: any;
  readonly code: string;
  readonly message: string;
  readonly path: PropertyKey[];
};

export type ZodErrorLike = {
  cause?: unknown;
  issues: ZodIssueLike[];
  name: string;
};

export type ZodSafeParseSuccessLike<TOutput> = {
  data: TOutput;
  error?: never;
  success: true;
};

export type ZodSafeParseErrorLike = {
  data?: never;
  error: ZodErrorLike;
  success: false;
};

export type ZodSafeParseResultLike<T> = ZodSafeParseErrorLike | ZodSafeParseSuccessLike<T>;

export type ZodTypeLike<TOutput, TInput = unknown> = {
  readonly _input: TInput;
  readonly _output: TOutput;
  safeParseAsync: (data: unknown) => Promise<ZodSafeParseResultLike<TOutput>>;
  '~standard': {
    [key: string]: any;
    vendor: string;
  };
};

export function isZodTypeLike(arg: unknown): arg is ZodTypeLike<unknown> {
  if (!isObjectLike(arg)) {
    return false;
  }
  const standardSchema: unknown = Reflect.get(arg, '~standard');
  return isPlainObject(standardSchema) && standardSchema.vendor === 'zod';
}

export function isZodV3Type(arg: unknown): arg is z3.ZodTypeAny {
  let prototype: null | object = null;
  if (isObject(arg) && isObject(arg.constructor)) {
    prototype = Reflect.getPrototypeOf(arg.constructor);
  }
  return Boolean(prototype && Reflect.get(prototype, 'name') === 'ZodType');
}
