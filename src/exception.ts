/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-dupe-class-members */

import { Err, err } from 'neverthrow';
import type { IsNever, RequiredKeysOf } from 'type-fest';

import type { ToAbstractConstructor } from './types.js';

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

type ExceptionConstructor<TParams extends ExceptionParams, TOptions extends ExceptionOptions> = {
  new (...args: ExceptionConstructorArgs<TParams, TOptions>): BaseException<TParams, TOptions>;
  asErr(...args: ExceptionConstructorArgs<TParams, TOptions>): Err<never, BaseException<TParams, TOptions>>;
  /** inference-only property that will be undefined at runtime */
  Instance: BaseException<TParams, TOptions>;
};

abstract class BaseException<TParams extends ExceptionParams, TOptions extends ExceptionOptions> extends Error {
  override cause: TOptions['cause'];
  details: TOptions['details'];
  abstract override name: TParams['name'];

  constructor(message?: string, options?: TOptions) {
    super(message);
    this.cause = options?.cause;
    this.details = options?.details;
  }

  toErr(): Err<never, this> {
    return err(this);
  }
}

type CoreExceptionConstructor = ToAbstractConstructor<ExceptionConstructor<ExceptionParams, ExceptionOptions>>;

type ExceptionBuildReturnType<
  TParams extends ExceptionParams,
  TOptions extends ExceptionOptions,
  TStaticProps = unknown
> = {
  [K in TParams['name']]: ExceptionConstructor<TParams, TOptions> & TStaticProps;
};

class ExceptionBuilder<
  TParams extends ExceptionParams | undefined,
  TOptions extends ExceptionOptions,
  TStaticMethods extends { [key: string]: unknown }
> {
  staticMethods = {} as TStaticMethods;
  private base: CoreExceptionConstructor = BaseException;
  private params?: TParams;

  static createCoreException<TName extends ExceptionName>(
    name: TName
  ): ExceptionBuildReturnType<{ name: TName }, ExceptionOptions> {
    const constructor = class extends BaseException<{ name: TName }, ExceptionOptions> {
      override name = name;
    };
    return this.createResult(constructor, name);
  }

  private static createResult<
    TConstructorParams extends ExceptionParams,
    TConstructorOptions extends ExceptionOptions,
    TStaticProps = unknown
  >(
    constructor: ToAbstractConstructor<ExceptionConstructor<TConstructorParams, TConstructorOptions>>,
    name: TConstructorParams['name'],
    props?: TStaticProps
  ): ExceptionBuildReturnType<TConstructorParams, TConstructorOptions, TStaticProps> {
    return { [name]: Object.assign(constructor, props) } as ExceptionBuildReturnType<
      TConstructorParams,
      TConstructorOptions,
      TStaticProps
    >;
  }
  build(): [TParams] extends [ExceptionParams]
    ? ExceptionBuildReturnType<NonNullable<TParams>, TOptions, TStaticMethods>
    : never;
  build(): ExceptionBuildReturnType<NonNullable<TParams>, TOptions, TStaticMethods> | never {
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
      static asErr(
        ...args: ExceptionConstructorArgs<NonNullable<TParams>, TOptions>
      ): Err<never, BaseException<NonNullable<TParams>, TOptions>> {
        return new this(...args).toErr();
      }
    };
    return ExceptionBuilder.createResult(constructor, params.name, this.staticMethods);
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

const { ValueException } = ExceptionBuilder.createCoreException('ValueException');

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

export type { ExceptionConstructor };
export { BaseException, ExceptionBuilder, OutOfRangeException, ValueException };
