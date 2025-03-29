import { Err, err, Ok, ok } from 'neverthrow';
import { describe, expect, it } from 'vitest';

import { asyncResultify } from '../result.js';

describe('asyncResultify', () => {
  it('should convert a successful Result to ResultAsync', async () => {
    const fn = () => Promise.resolve(ok(42));
    const result = (await asyncResultify(fn)) as Ok<number, never>;
    expect(result.isOk()).toBe(true);
    expect(result.value).toBe(42);
  });

  it('should convert an error Result to ResultAsync', async () => {
    const error = new Error('test error');
    const fn = () => Promise.resolve(err(error));
    const result = (await asyncResultify(fn)) as Err<never, Error>;
    expect(result.isErr()).toBe(true);
    expect(result.error).toBe(error);
  });

  it('should handle async operations correctly', async () => {
    const fn = async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return ok('delayed result');
    };
    const result = (await asyncResultify(fn)) as Ok<string, never>;
    expect(result.isOk()).toBe(true);
    expect(result.value).toBe('delayed result');
  });
});
