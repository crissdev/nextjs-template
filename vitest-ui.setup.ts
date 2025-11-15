import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from 'vitest-browser-react';

import { msw } from './tests/ui/msw';

beforeAll(async () => {
  msw.events.on('request:start', ({ request }) => {
    console.log('MSW intercepted', request.method, request.url);
  });

  await msw.start({ onUnhandledRequest: 'bypass' });
});

afterEach(async () => {
  msw.resetHandlers();
  await cleanup();
});

afterAll(() => msw.stop());
