import { vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('client-only', () => ({}));
vi.mock('next/cache');
vi.mock('next/server');
vi.mock('next/headers');
vi.mock('next/navigation');
