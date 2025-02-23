/* eslint-disable no-dupe-class-members */

import type { IsNever, RequiredKeysOf, Simplify } from 'type-fest';

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

class ExceptionBuilder<TParams extends ExceptionParams | undefined, TOptions extends ExceptionOptions> {
  params?: TParams;

  build(): [TParams] extends [ExceptionParams] ? ExceptionConstructor<TParams, TOptions> : never;
  build(): ExceptionConstructor<NonNullable<TParams>, TOptions> | never {
    if (!this.params) {
      throw new Error('Cannot build exception: params is undefined');
    }
    const params = this.params;
    return class extends BaseException<NonNullable<TParams>, TOptions> {
      override name = params.name;
      constructor(...args: ExceptionConstructorArgs<NonNullable<TParams>, TOptions>) {
        const [message, options] = (params.message ? [params.message, args[0]] : args) as [string, TOptions];
        super(message, options);
      }
    };
  }

  setOptionsType<TUpdatedOptions extends ExceptionOptions>() {
    return this as unknown as ExceptionBuilder<TParams, TUpdatedOptions>;
  }

  setParams<const TUpdatedParams extends NonNullable<TParams>>(params: TUpdatedParams) {
    this.params = params;
    return this as unknown as ExceptionBuilder<TUpdatedParams, TOptions>;
  }
}

export type { ExceptionConstructor, ExceptionInstance };
export { BaseException, ExceptionBuilder };
