import type { CamelCase, SnakeCase } from 'type-fest';

export function camelToSnakeCase<T extends string>(s: T) {
  return s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`) as SnakeCase<T>;
}

export function snakeToCamelCase<T extends string>(s: T) {
  return s
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', '')) as CamelCase<T>;
}
