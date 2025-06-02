import { ok } from 'neverthrow';
import type { Result } from 'neverthrow';
import type { z as z3 } from 'zod/v3';
import { z as z4 } from 'zod/v4';

import { ValidationException } from './exception.js';
import { isNumberLike, parseNumber } from './number.js';
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
  safeParseAsync: (data: unknown) => Promise<ZodSafeParseResultLike<NoInfer<TOutput>>>;
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

export const $BooleanLike: z4.ZodType<boolean> = z4.preprocess((arg) => {
  if (typeof arg === 'string') {
    if (arg.trim().toLowerCase() === 'true') {
      return true;
    } else if (arg.trim().toLowerCase() === 'false') {
      return false;
    }
  }
  return arg;
}, z4.boolean());

export const $NumberLike: z4.ZodType<number> = z4.preprocess((arg) => {
  if (isNumberLike(arg)) {
    return parseNumber(arg);
  }
  return arg;
}, z4.number());

export const $UrlLike: z4.ZodType<URL> = z4.preprocess(
  (arg) => {
    if (arg instanceof URL) {
      return arg.href;
    }
    return arg;
  },
  z4
    .string()
    .url()
    .transform((arg) => new URL(arg))
);

export const $Uint8ArrayLike: z4.ZodType<Uint8Array> = z4
  .union([z4.array(z4.number().int().min(0).max(255)), z4.instanceof(Uint8Array), z4.instanceof(ArrayBuffer)])
  .transform((arg) => {
    if (!(arg instanceof Uint8Array)) {
      return new Uint8Array(arg);
    }
    return arg;
  });

export const $AnyFunction = z4.custom<(...args: any[]) => any>((arg) => typeof arg === 'function', 'must be function');

export const $$Function = <TInput extends [z4.ZodType, ...z4.ZodType[]], TOutput extends z4.ZodType>({
  input,
  output
}: {
  input: TInput;
  output: TOutput;
}): z4.ZodType<(...args: z4.output<z4.ZodTuple<TInput, null>>) => z4.output<TOutput>> => {
  const $Schema = z4.function({
    input: z4.tuple(input),
    output
  });
  return z4.custom().transform((arg, ctx) => {
    if (typeof arg !== 'function') {
      ctx.addIssue('Must be function');
      return z4.NEVER;
    }
    return $Schema.implement(arg as (...args: any[]) => any);
  });
};

export function safeParse<TSchema extends z4.ZodTypeAny>(
  data: unknown,
  $Schema: TSchema
): Result<z4.infer<TSchema>, typeof ValidationException.Instance> {
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

export { isZodType, isZodTypeLike };
export type {
  ZodErrorLike,
  ZodIssueLike,
  ZodSafeParseErrorLike,
  ZodSafeParseResultLike,
  ZodSafeParseSuccessLike,
  ZodTypeLike
};
