import { describe, expectTypeOf } from 'vitest';

import type { ToAbstractConstructor } from '../types.js';

describe('ToAbstractConstructor', () => {
  expectTypeOf<ToAbstractConstructor<new () => { foo: string }>>().toEqualTypeOf<abstract new () => { foo: string }>();
});
