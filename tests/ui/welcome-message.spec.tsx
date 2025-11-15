import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import WelcomeMessage from '@/lib/ui/components/shared/welcome-message';

test('Render the welcome message', async () => {
  await render(<WelcomeMessage />);

  await expect.element(page.getByText('Welcome!', { exact: true })).toBeVisible();
});
