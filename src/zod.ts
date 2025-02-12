import { z } from 'zod';

import { isObject } from './object.js';

/** Used to determine if object is of type `ZodType` independent of specific instances or library versions */
export function isZodType(arg: unknown): arg is z.ZodTypeAny {
  let prototype: null | object = null;
  if (isObject(arg) && isObject(arg.constructor)) {
    prototype = Reflect.getPrototypeOf(arg.constructor);
  }
  return Boolean(prototype && Reflect.get(prototype, 'name') === 'ZodType');
}

export function $BooleanLike({ optional }: { optional?: boolean } = { optional: false }) {
  const schema = z.preprocess(
    (arg) => {
      if (typeof arg === 'string') {
        if (!arg) {
          return undefined;
        } else if (arg.trim().toLowerCase() === 'true') {
          return true;
        } else if (arg.trim().toLowerCase() === 'false') {
          return false;
        }
      }
      return arg;
    },
    optional ? z.boolean().optional() : z.boolean()
  );
  schema.optional = () => {
    throw new Error('Cannot set optional with method: instead, use $BooleanLike({ optional: true })');
  };
  return schema;
}
