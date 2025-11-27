import test from '@playwright/test';

import { PLAYWRIGHT_AUTH_STATE_PATH } from '../../playwright.config';

test('Authenticate and save state', async ({ page }) => {
  await page.goto('/');
  await page.context().storageState({ path: PLAYWRIGHT_AUTH_STATE_PATH });
});
