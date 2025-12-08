import { vi } from 'vitest';

export let headers = vi.fn().mockResolvedValue({});

export let cookies = vi.fn().mockResolvedValue({
  set: vi.fn(),
});
