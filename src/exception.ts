/* eslint-disable no-dupe-class-members */

import type { IsNever, RequiredKeysOf, Simplify } from 'type-fest';

import type { ToAbstractConstructor } from './types.js';

type ExceptionOptions = Simplify<
  ErrorOptions & {
    details?: {
      [key: string]: unknown;
    };
  }
>;

type ExceptionParams = {
  message?: string;
  name: string;
};

type ExceptionInstance<TParams extends ExceptionParams, TOptions extends ExceptionOptions> = Error & {
  cause: TOptions['cause'];
  details: TOptions['details'];
  name: TParams['name'];
};

type ExceptionConstructorArgs<TParams extends ExceptionParams, TOptions extends ExceptionOptions> =
  IsNever<RequiredKeysOf<TOptions>> extends true
    ? [message?: string, options?: TOptions]
    : TParams extends { message: string }
      ? [TOptions]
      : [message: string, options: TOptions];

type ExceptionConstructor<TParams extends ExceptionParams, TOptions extends ExceptionOptions> = new (
  ...args: ExceptionConstructorArgs<TParams, TOptions>
) => ExceptionInstance<TParams, TOptions>;

abstract class BaseException<TParams extends ExceptionParams, TOptions extends ExceptionOptions>
  extends Error
  implements ExceptionInstance<TParams, TOptions>
{
  public override cause: TOptions['cause'];
  public details: TOptions['details'];
  public abstract override name: TParams['name'];

  constructor(message?: string, options?: TOptions) {
    super(message);
    this.cause = options?.cause;
    this.details = options?.details;
  }
}

type CoreExceptionConstructor = ToAbstractConstructor<ExceptionConstructor<ExceptionParams, ExceptionOptions>>;

class ExceptionBuilder<TParams extends ExceptionParams | undefined, TOptions extends ExceptionOptions> {
  private base: CoreExceptionConstructor = BaseException;
  private params?: TParams;

  static createCoreException<TName extends string>(name: TName): CoreExceptionConstructor {
    return class extends BaseException<{ name: TName }, ExceptionOptions> {
      override name = name;
    };
  }

  build(): [TParams] extends [ExceptionParams] ? ExceptionConstructor<TParams, TOptions> : never;
  build(): ExceptionConstructor<NonNullable<TParams>, TOptions> | never {
    if (!this.params) {
      throw new Error('Cannot build exception: params is undefined');
    }
    const params = this.params;
    return class extends this.base {
      override name = params.name;
      constructor(...args: ExceptionConstructorArgs<NonNullable<TParams>, TOptions>) {
        const [message, options] = (params.message ? [params.message, args[0]] : args) as [string, TOptions];
        super(message, options);
      }
    };
  }
  extend(constructor: CoreExceptionConstructor) {
    this.base = constructor;
    return this;
  }

  setOptionsType<TUpdatedOptions extends ExceptionOptions>() {
    return this as unknown as ExceptionBuilder<TParams, TUpdatedOptions>;
  }

  setParams<const TUpdatedParams extends NonNullable<TParams>>(params: TUpdatedParams) {
    this.params = params;
    return this as unknown as ExceptionBuilder<TUpdatedParams, TOptions>;
  }
}

const ValueError = ExceptionBuilder.createCoreException('ValueError');

const OutOfRangeError = new ExceptionBuilder().extend(ValueError).setParams({ name: 'OutOfRangeError' }).build();

export type { ExceptionConstructor, ExceptionInstance };
export { BaseException, ExceptionBuilder, OutOfRangeError, ValueError };
