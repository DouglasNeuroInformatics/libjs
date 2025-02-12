import type { z } from 'zod';

import { isObject } from './object.js';

/** Used to determine if object is of type `ZodType` independent of specific instances or library versions */
export function isZodType(arg: unknown): arg is z.ZodTypeAny {
  let prototype: null | object = null;
  if (isObject(arg) && isObject(arg.constructor)) {
    prototype = Reflect.getPrototypeOf(arg.constructor);
  }
  return Boolean(prototype && Reflect.get(prototype, 'name') === 'ZodType');
}
