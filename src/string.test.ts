import { describe, expect, it } from 'vitest';

import { camelToSnakeCase, snakeToCamelCase } from './string.js';

describe('camelToSnakeCase', () => {
  it('should convert from camel to snake case ', () => {
    expect(camelToSnakeCase('toSnakeCase')).toBe('to_snake_case');
    expect(camelToSnakeCase('foo')).toBe('foo');
    expect(camelToSnakeCase('')).toBe('');
  });
});

describe('snakeToCamelCase', () => {
  it('should convert from snake to camel case ', () => {
    expect(snakeToCamelCase('to_camel_case')).toBe('toCamelCase');
    expect(camelToSnakeCase('foo')).toBe('foo');
    expect(camelToSnakeCase('')).toBe('');
  });
});
