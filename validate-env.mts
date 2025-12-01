import { styleText } from 'node:util';

import nextEnv from '@next/env';
import z, { type ZodError } from 'zod';

let envSchema = z.object({
  DATABASE_URL: z.string().startsWith('postgres://'),
  NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: z.string().length(44),
});

nextEnv.loadEnvConfig(process.cwd(), true);

try {
  envSchema.parse(process.env);
  console.log('Environment variables are valid.');
} catch (err) {
  if (!isZodError(err)) throw err;
  console.error(styleText('red', 'Environment variables are not valid.'));
  console.error(styleText('red', err.toString()));
  process.exit(1);
}

function isZodError(err: unknown): err is ZodError {
  return (err as ZodError).name === 'ZodError';
}
