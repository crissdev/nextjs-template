import { expect, test } from '@playwright/test';

test('Show welcome message @smoke', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Welcome!');
});
