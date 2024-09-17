import type { CamelCase, Primitive, SnakeCase } from 'type-fest';

export function camelToSnakeCase<T extends string>(s: T) {
  return s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`) as SnakeCase<T>;
}

export function snakeToCamelCase<T extends string>(s: T) {
  return s
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', '')) as CamelCase<T>;
}

export function uncapitalize<T extends string>(s: T) {
  return (s.charAt(0).toLowerCase() + s.slice(1)) as Uncapitalize<T>;
}

export function capitalize<T extends string>(s: T) {
  return (s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<T>;
}

export function toLowerCase<T extends string>(s: T) {
  return s.toLowerCase() as Lowercase<T>;
}

export function toUpperCase<T extends string>(s: T) {
  return s.toUpperCase() as Uppercase<T>;
}

export function format(s: string, ...args: Exclude<Primitive, symbol>[]) {
  for (const arg of args) {
    s = s.replace('{}', String(arg));
  }
  return s;
}
