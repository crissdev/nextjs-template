import { styleText } from 'node:util';

import { loadEnvConfig } from '@next/env';
import { defineConfig, env } from 'prisma/config';

let { loadedEnvFiles } = loadEnvConfig(process.cwd(), process.env.NODE_ENV === 'development');
console.info(styleText('cyan', '[prisma.config.ts]'), 'Environments:', loadedEnvFiles.map((f) => f.path).join(', '));

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
