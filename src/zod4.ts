import type { z as z3 } from 'zod/v3';
import type { z as z4 } from 'zod/v4';

import { isObject, isObjectLike, isPlainObject } from './object.js';

type ZodIssueLike = {
  [key: string]: any;
  readonly code: string;
  readonly message: string;
  readonly path: PropertyKey[];
};

type ZodErrorLike = {
  cause?: unknown;
  issues: ZodIssueLike[];
  name: string;
};

type ZodSafeParseSuccessLike<TOutput> = {
  data: TOutput;
  error?: never;
  success: true;
};

type ZodSafeParseErrorLike = {
  data?: never;
  error: ZodErrorLike;
  success: false;
};

type ZodSafeParseResultLike<T> = ZodSafeParseErrorLike | ZodSafeParseSuccessLike<T>;

type ZodTypeLike<TOutput, TInput = unknown> = {
  [key: string]: any;
  readonly _input: TInput;
  readonly _output: TOutput;
  safeParseAsync: (data: unknown) => Promise<ZodSafeParseResultLike<TOutput>>;
  '~standard': {
    [key: string]: any;
    vendor: string;
  };
};

function isZodTypeLike(arg: unknown): arg is ZodTypeLike<unknown> {
  if (!isObjectLike(arg)) {
    return false;
  }
  const standardSchema: unknown = Reflect.get(arg, '~standard');
  return isPlainObject(standardSchema) && standardSchema.vendor === 'zod';
}

function isZodV3Type(arg: unknown): arg is z3.ZodTypeAny {
  let prototype: null | object = null;
  if (isObject(arg) && isObject(arg.constructor)) {
    prototype = Reflect.getPrototypeOf(arg.constructor);
  }
  return Boolean(prototype && Reflect.get(prototype, 'name') === 'ZodType');
}

function isZodV4Type(arg: unknown): arg is z4.ZodType {
  if (!isZodTypeLike(arg)) {
    return false;
  }
  const zod: unknown = arg._zod;
  if (!isPlainObject(zod)) {
    return false;
  }
  const version: unknown = zod.version;
  return isPlainObject(version) && version.major === 4;
}

function isZodType(arg: unknown, options: { version: 3 }): arg is z3.ZodTypeAny;
function isZodType(arg: unknown, options: { version: 4 }): arg is z4.ZodType;
function isZodType(arg: unknown, options: { version: 3 | 4 }): boolean {
  return options.version === 3 ? isZodV3Type(arg) : isZodV4Type(arg);
}

export { isZodType, isZodTypeLike };
export type {
  ZodErrorLike,
  ZodIssueLike,
  ZodSafeParseErrorLike,
  ZodSafeParseResultLike,
  ZodSafeParseSuccessLike,
  ZodTypeLike
};
