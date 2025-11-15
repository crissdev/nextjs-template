import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.spec.ts'],
    setupFiles: ['./vitest-unit.setup.ts'],
    coverage: {
      exclude: ['src/**/*.d.ts'],
    },
    clearMocks: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
