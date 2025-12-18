import 'server-only';

import pino from 'pino';

import { type Logger } from '@/lib/server/logger';

export function createLogger(): Logger {
  return pino({
    level: 'info',
    transport:
      process.env.NODE_ENV === 'development' ? { target: 'pino-pretty', options: { singleLine: true } } : undefined,
  });
}
