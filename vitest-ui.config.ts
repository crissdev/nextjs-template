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
      screenshotFailures: !!process.env.CI,
      trace: 'retain-on-failure',
    },
    include: ['tests/ui/**/*.spec.tsx'],
    setupFiles: ['./vitest-ui.setup.ts'],
    coverage: {
      exclude: ['src/lib/ui/components/cn', 'src/**/*.d.ts', 'tests/ui'],
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
