import { expectTypeOf, test } from 'vitest';

import type { ToAbstractConstructor } from '../types.js';

test('ToAbstractConstructor', () => {
  expectTypeOf<ToAbstractConstructor<new () => { foo: string }>>().toEqualTypeOf<abstract new () => { foo: string }>();
});
