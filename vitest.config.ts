import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'jsdom',
    testTimeout: 120000,
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/types.ts', 'src/abhidhamma-srs/types.ts'],
      reporter: ['text', 'json-summary'],
    },
  },
});
