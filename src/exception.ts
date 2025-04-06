/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-dupe-class-members */

import cleanStack from 'clean-stack';
import extractStack from 'extract-stack';
import stringifyObject from 'stringify-object';
import type { IsNever, RequiredKeysOf } from 'type-fest';
import type { z } from 'zod';

import { objectify } from './object.js';
import { indentLines } from './string.js';
import { err, errAsync, Result, ResultAsync } from './vendor/neverthrow.js';

import type { SingleKeyMap, ToAbstractConstructor } from './types.js';

type ExceptionName = `${string}Exception`;

type ExceptionOptions = {
  cause?: unknown;
  details?: {
    [key: string]: unknown;
  };
};

type ExceptionParams<TDetails = any> = {
  message?: ((details: TDetails) => string) | string;
  name: ExceptionName;
};

type ExceptionConstructorArgs<TParams extends ExceptionParams, TOptions extends ExceptionOptions> =
  IsNever<RequiredKeysOf<TOptions>> extends true
    ? [message?: string, options?: TOptions]
    : TParams extends { message: ((details: any) => string) | string }
      ? [TOptions]
      : [message: string, options: TOptions];

type ExceptionStatic<TParams extends ExceptionParams, TOptions extends ExceptionOptions> = {
  /** return an instance of the exception wrapped in a neverthrow Result */
  asAsyncErr(
    ...args: ExceptionConstructorArgs<TParams, TOptions>
  ): ResultAsync<never, BaseException<TParams, TOptions>>;
  /** return an instance of the exception wrapped in a neverthrow Result */
  asErr(...args: ExceptionConstructorArgs<TParams, TOptions>): Result<never, BaseException<TParams, TOptions>>;
  /** inference-only property that will be undefined at runtime */
  Instance: BaseException<TParams, TOptions>;
};

type ExceptionConstructor<TParams extends ExceptionParams, TOptions extends ExceptionOptions> = new (
  ...args: ExceptionConstructorArgs<TParams, TOptions>
) => BaseException<TParams, TOptions>;

type ExceptionType<
  TParams extends ExceptionParams = ExceptionParams,
  TOptions extends ExceptionOptions = ExceptionOptions,
  TStaticProps = unknown
> = ExceptionConstructor<TParams, TOptions> & ExceptionStatic<TParams, TOptions> & TStaticProps;

interface ExceptionLike extends Error, ExceptionOptions {
  name: string;
  toAsyncErr(): ResultAsync<never, this>;
  toErr(): Result<never, this>;
  toString(): string;
}

function parseStack(stack: string | undefined): string[];
function parseStack(error: Error): string[];
function parseStack(errorOrStack: Error | string | undefined): string[] {
  const stack = typeof errorOrStack === 'string' ? errorOrStack : errorOrStack?.stack;
  return extractStack.lines(cleanStack(stack, { pretty: true }));
}

abstract class BaseException<TParams extends ExceptionParams, TOptions extends ExceptionOptions>
  extends Error
  implements ExceptionLike
{
  override cause: TOptions['cause'];
  details: TOptions['details'];
  abstract override name: TParams['name'];

  constructor(message?: string, options?: TOptions) {
    super(message);
    this.cause = options?.cause;
    this.details = options?.details;
  }

  toAsyncErr(): ResultAsync<never, this> {
    return errAsync(this);
  }

  toErr(): Result<never, this> {
    return err(this);
  }

  override toString(): string {
    const result: string[] = [];
    this.extractCauses(this).forEach((error) => {
      result.push(this.formatError(error));
      result.push('\nThe above exception was the cause of the following exception:\n');
    });
    result.push(this.formatError(this));
    return result.join('\n');
  }

  private extractCauses(error: Error): Error[] {
    const errors: Error[] = [];
    let cause: unknown = error.cause;
    while (cause instanceof Error) {
      errors.push(cause);
      cause = cause.cause;
    }
    return errors.toReversed();
  }

  private formatError(error: Error & { details?: { [key: string]: unknown } }): string {
    const result = [`${error.name}: ${error.message}`];
    parseStack(error).forEach((line) => {
      result.push(`    at ${line}`);
    });
    if (error.details) {
      result.push(indentLines(`details: ${stringifyObject(error.details, { indent: '  ' })}`, 4));
    }
    return result.join('\n');
  }
}

type CoreExceptionConstructor = ToAbstractConstructor<ExceptionConstructor<ExceptionParams, ExceptionOptions>>;

class ExceptionBuilder<
  TParams extends ExceptionParams | undefined,
  TOptions extends ExceptionOptions,
  TStaticMethods extends { [key: string]: unknown }
> {
  private base: CoreExceptionConstructor = BaseException;
  private params?: TParams;
  private staticMethods = {} as TStaticMethods;

  build(): [TParams] extends [ExceptionParams]
    ? SingleKeyMap<TParams['name'], ExceptionType<NonNullable<TParams>, TOptions, TStaticMethods>>
    : never;
  build(): SingleKeyMap<NonNullable<TParams>['name'], ExceptionType<NonNullable<TParams>, TOptions, TStaticMethods>> {
    if (!this.params) {
      throw new Error('Cannot build exception: params is undefined');
    }
    const params = this.params;
    const constructor: ExceptionConstructor<NonNullable<TParams>, TOptions> = class extends this.base {
      static Instance: BaseException<NonNullable<TParams>, TOptions>;
      override name = params.name;
      constructor(...args: ExceptionConstructorArgs<NonNullable<TParams>, TOptions>) {
        let message: string | undefined, options: TOptions | undefined;
        if (params.message) {
          options = args[0] as TOptions;
          message = typeof params.message === 'function' ? params.message(options.details) : params.message;
        } else {
          message = args[0];
          options = args[1];
        }
        super(message, options);
      }
      static asAsyncErr(
        ...args: ExceptionConstructorArgs<NonNullable<TParams>, TOptions>
      ): ResultAsync<never, BaseException<NonNullable<TParams>, TOptions>> {
        return new this(...args).toAsyncErr();
      }
      static asErr(
        ...args: ExceptionConstructorArgs<NonNullable<TParams>, TOptions>
      ): Result<never, BaseException<NonNullable<TParams>, TOptions>> {
        return new this(...args).toErr();
      }
    };
    return objectify(params.name, Object.assign(constructor, this.staticMethods));
  }

  extend(constructor: CoreExceptionConstructor): this {
    this.base = constructor;
    return this;
  }

  setOptionsType<TUpdatedOptions extends ExceptionOptions>(): ExceptionBuilder<
    TParams,
    TUpdatedOptions,
    TStaticMethods
  > {
    return this as any;
  }

  setParams<const TUpdatedParams extends ExceptionParams<TOptions['details']>>(
    params: TUpdatedParams
  ): ExceptionBuilder<TUpdatedParams, TOptions, TStaticMethods> {
    this.params = params as unknown as TParams;
    return this as any;
  }

  setStaticMethod<
    TName extends string,
    TMethod extends (this: ExceptionConstructor<NonNullable<TParams>, TOptions>, ...args: any[]) => any
  >(name: TName, method: TMethod): ExceptionBuilder<TParams, TOptions, TStaticMethods & { [K in TName]: TMethod }> {
    this.staticMethods = { ...this.staticMethods, [name]: method };
    return this as any;
  }
}

const { RuntimeException } = new ExceptionBuilder().setParams({ name: 'RuntimeException' }).build();

const { ValueException } = new ExceptionBuilder().setParams({ name: 'ValueException' }).build();

const { OutOfRangeException } = new ExceptionBuilder()
  .extend(ValueException)
  .setOptionsType<{ details: { max: number; min: number; value: number } }>()
  .setParams({
    message: ({ max, min, value }) => `Value ${value} is out of range (${min} - ${max})`,
    name: 'OutOfRangeException'
  })
  .setStaticMethod('forNonPositive', function (value: number) {
    return new this({ details: { max: Infinity, min: 0, value } });
  })
  .build();

export const { ValidationException } = new ExceptionBuilder()
  .setOptionsType<{ details: { data: unknown; issues: z.ZodIssue[] } }>()
  .setParams({ message: 'Zod schema validation failed', name: 'ValidationException' })
  .build();

export type {
  ExceptionConstructor,
  ExceptionConstructorArgs,
  ExceptionLike,
  ExceptionName,
  ExceptionOptions,
  ExceptionParams,
  ExceptionStatic,
  ExceptionType
};
export { BaseException, ExceptionBuilder, OutOfRangeException, parseStack, RuntimeException, ValueException };
