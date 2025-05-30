import { isObjectLike, isPlainObject } from './object.js';

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
