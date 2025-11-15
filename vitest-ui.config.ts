import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      headless: !!process.env.CI,
      // https://vitest.dev/guide/browser/playwright
      instances: [{ browser: 'chromium' }],
      viewport: {
        width: 1200,
        height: 600,
      },
      trace: 'retain-on-failure',
    },
    include: ['tests/ui/**/*.spec.tsx'],
    setupFiles: ['./vitest-ui.setup.ts'],
    coverage: {
      exclude: ['src/lib/cn', 'src/**/*.d.ts'],
    },
    clearMocks: true,
    testTimeout: 5000,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
