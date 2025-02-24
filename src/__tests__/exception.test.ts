import type { Simplify } from 'type-fest';
import { describe, expect, expectTypeOf, it, test } from 'vitest';

import { BaseException, ExceptionBuilder, OutOfRangeException, ValueException } from '../exception.js';

import type { ExceptionConstructor, ExceptionInstance } from '../exception.js';

type ExceptionOptionsWithCode = Simplify<ErrorOptions & { details: { code: number } }>;
type ExceptionOptionsWithCause = Simplify<ErrorOptions & { cause: Error }>;
type ExceptionOptionsWithCodeAndCause = Simplify<ExceptionOptionsWithCause & ExceptionOptionsWithCode>;

type ExceptionParams = { name: 'TestException' };
type ExceptionParamsWithMessage = Simplify<ExceptionParams & { message: string }>;

test('ExceptionConstructor', () => {
  expectTypeOf<ExceptionConstructor<ExceptionParams, ErrorOptions>>().toEqualTypeOf<
    new (message?: string, options?: ErrorOptions) => ExceptionInstance<ExceptionParams, ErrorOptions>
  >();
  expectTypeOf<ExceptionConstructor<ExceptionParams, ExceptionOptionsWithCode>>().toEqualTypeOf<
    new (
      message: string,
      options: ExceptionOptionsWithCode
    ) => ExceptionInstance<ExceptionParams, ExceptionOptionsWithCode>
  >();
  expectTypeOf<ExceptionConstructor<ExceptionParams, ExceptionOptionsWithCause>>().toEqualTypeOf<
    new (
      message: string,
      options: ExceptionOptionsWithCause
    ) => ExceptionInstance<ExceptionParams, ExceptionOptionsWithCause>
  >();
  expectTypeOf<ExceptionConstructor<ExceptionParams, ExceptionOptionsWithCodeAndCause>>().toEqualTypeOf<
    new (
      message: string,
      options: ExceptionOptionsWithCodeAndCause
    ) => ExceptionInstance<ExceptionParams, ExceptionOptionsWithCodeAndCause>
  >();
  expectTypeOf<ExceptionConstructor<ExceptionParamsWithMessage, ExceptionOptionsWithCodeAndCause>>().toEqualTypeOf<
    new (
      options: ExceptionOptionsWithCodeAndCause
    ) => ExceptionInstance<ExceptionParamsWithMessage, ExceptionOptionsWithCodeAndCause>
  >();
});

describe('BaseException', () => {
  it('should have parameters assignable to the base Error constructor by default', () => {
    expectTypeOf<ConstructorParameters<typeof BaseException>>().toMatchTypeOf<ConstructorParameters<typeof Error>>();
  });
  it('should allow explicit types for cause and details', () => {
    expectTypeOf<Pick<BaseException<any, { cause: Error }>, 'cause'>>().toEqualTypeOf<{ cause: Error }>();
    expectTypeOf<Pick<BaseException<any, { details: { code: number } }>, 'details'>>().toEqualTypeOf<{
      details: { code: number };
    }>();
    expectTypeOf<
      Pick<BaseException<any, { cause: Error; details: { code: number } }>, 'cause' | 'details'>
    >().toEqualTypeOf<{ cause: Error; details: { code: number } }>();
  });
});

describe('ExceptionBuilder', () => {
  it('should return never for the build method if no name is specified', () => {
    const fn = () => new ExceptionBuilder().build();
    expect(fn).toThrow('Cannot build exception: params is undefined');
    expectTypeOf<ReturnType<typeof fn>>().toBeNever();
  });
  it('should build an exception with the provided name and message', () => {
    const { TestException } = new ExceptionBuilder().setParams({ name: 'TestException' }).build();
    expect(Object.getPrototypeOf(TestException)).toBe(BaseException);
    expectTypeOf<Pick<InstanceType<typeof TestException>, 'name'>>().toEqualTypeOf<{ name: 'TestException' }>();
    const error = new TestException('This is a test');
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('This is a test');
    expect(error.name).toBe('TestException');
  });

  it('should create distinct constructors', () => {
    const { TestException } = new ExceptionBuilder().setParams({ name: 'TestException' }).build();
    const { OtherException } = new ExceptionBuilder().setParams({ name: 'OtherException' }).build();
    const e1 = new TestException('This is a test');
    const e2 = new OtherException('This is a test');
    expect(e1).toBeInstanceOf(BaseException);
    expect(e1).not.toBeInstanceOf(OtherException);
    expect(e2).toBeInstanceOf(BaseException);
    expect(e2).not.toBeInstanceOf(TestException);
  });

  it('should allow creating an exception with additional details', () => {
    const { TestException } = new ExceptionBuilder()
      .setParams({ name: 'TestException' })
      .setOptionsType<{ details: { code: number } }>()
      .build();
    const error = new TestException('This is a test', { details: { code: 0 } });
    expect(error.details.code).toBe(0);
    expectTypeOf<ConstructorParameters<typeof TestException>>().toEqualTypeOf<
      [message: string, options: { details: { code: number } }]
    >();
  });

  it('should allow creating an error with a custom cause', () => {
    const { TestException } = new ExceptionBuilder()
      .setParams({ name: 'TestException' })
      .setOptionsType<{ cause: Error }>()
      .build();
    const error = new TestException('This is a test', { cause: new Error('Test') });
    expect(error.cause.message).toBe('Test');
    expectTypeOf<ConstructorParameters<typeof TestException>>().toEqualTypeOf<
      [message: string, options: { cause: Error }]
    >();
  });

  it('should allow creating an error with a default message', () => {
    const { TestException } = new ExceptionBuilder()
      .setParams({ message: 'Custom message', name: 'TestException' })
      .setOptionsType<{ cause: Error }>()
      .build();
    const error = new TestException({ cause: new Error('Test') });
    expect(error.message).toBe('Custom message');
    expectTypeOf<ConstructorParameters<typeof TestException>>().toEqualTypeOf<[options: { cause: Error }]>();
  });
});

describe('ValueException', () => {
  it('should have the correct prototype', () => {
    expect(Object.getPrototypeOf(ValueException)).toBe(BaseException);
  });
});

describe('OutOfRangeException', () => {
  it('should have the correct prototype', () => {
    expect(Object.getPrototypeOf(OutOfRangeException)).toBe(ValueException);
  });
  describe('constructor', () => {
    it('should create the correct message', () => {
      const error = new OutOfRangeException({
        details: {
          max: Infinity,
          min: 0,
          value: -1
        }
      });
      expect(error.message).toBe('Value -1 is out of range (0 - Infinity)');
    });
  });
  describe('ForNonPositive', () => {
    it('should create the correct message', () => {
      const error = OutOfRangeException.forNonPositive(-1);
      expect(error.message).toBe('Value -1 is out of range (0 - Infinity)');
    });
  });
});
