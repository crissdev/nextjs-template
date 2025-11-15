import { describe, expect, test } from 'vitest';

import getNodeVersion from '@/lib/server/node-version';

describe('example', () => {
  test('Retrieve node version', () => {
    expect(getNodeVersion()).toBeTruthy();
  });
});
