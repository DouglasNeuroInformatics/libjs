import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: ['src/index.ts', 'src/types.ts', 'src/vendor'],
      include: ['src/**/*'],
      provider: 'v8',
      skipFull: true,
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100
      }
    },
    watch: false
  }
});
