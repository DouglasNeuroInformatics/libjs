import { describe, expect, it } from 'vitest';

import {
  camelToSnakeCase,
  capitalize,
  format,
  indentLines,
  snakeToCamelCase,
  toLowerCase,
  toUpperCase,
  uncapitalize
} from '../string.js';

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

describe('capitalize', () => {
  it('should convert the first letter of the string to a capital letter', () => {
    expect(capitalize('foo')).toBe('Foo');
    expect(capitalize('FOO')).toBe('FOO');
    expect(capitalize('foo bar')).toBe('Foo bar');
  });
});

describe('uncapitalize', () => {
  it('should convert the first letter of the string to a lowercase letter', () => {
    expect(uncapitalize('Foo')).toBe('foo');
    expect(uncapitalize('foo')).toBe('foo');
    expect(uncapitalize('Foo bar')).toBe('foo bar');
  });
});

describe('toLowerCase', () => {
  it('should convert to lower case', () => {
    expect(toLowerCase('FOO')).toBe('foo');
  });
});

describe('toUpperCase', () => {
  it('should convert to upper case', () => {
    expect(toUpperCase('foo')).toBe('FOO');
  });
});

describe('format', () => {
  it('should return the same string if no positional args are given', () => {
    expect(format('Hello')).toBe('Hello');
    expect(format('Hello {}')).toBe('Hello {}');
  });
  it('should insert positional arguments', () => {
    expect(format('Hello {}', 'World')).toBe('Hello World');
    expect(format('Hello {}. {}.', 'World', 'This function works')).toBe('Hello World. This function works.');
  });
  it('should ignore additional indices', () => {
    expect(format('Hello {}{}.', 'World')).toBe('Hello World{}.');
  });
});

describe('indentLines', () => {
  it('indents all lines with 2 spaces', () => {
    const input = 'Hello\nWorld';
    const expected = '  Hello\n  World';
    expect(indentLines(input, 2)).toBe(expected);
  });

  it('indents all lines with 4 spaces', () => {
    const input = 'Hello\nWorld';
    const expected = '    Hello\n    World';
    expect(indentLines(input, 4)).toBe(expected);
  });

  it('handles single-line input', () => {
    expect(indentLines('Hello', 3)).toBe('   Hello');
  });

  it('handles multiple empty lines', () => {
    const input = '\n\nHello\n\nWorld\n';
    const expected = '  \n  \n  Hello\n  \n  World\n  ';
    expect(indentLines(input, 2)).toBe(expected);
  });
});
