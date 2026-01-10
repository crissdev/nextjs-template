import { execSync } from 'node:child_process';

import { PrismaPg } from '@prisma/adapter-pg';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { afterEach, beforeEach, vi } from 'vitest';

import { PrismaClient } from '@/lib/server/db/prisma/.generated/client';
import { setPrismaClient } from '@/lib/server/db/prisma-client';

vi.mock('server-only', () => ({}));
vi.mock('client-only', () => ({}));
vi.mock('next/cache');
vi.mock('next/headers');
vi.mock('next/navigation');
vi.mock('next/server');

let container: StartedPostgreSqlContainer;
const PG_VERSION = '17-alpine';
let containerImage = `postgres:${PG_VERSION}`;

beforeEach(async () => {
  try {
    container = await new PostgreSqlContainer(containerImage).start();
    let connectionString = container.getConnectionUri();

    setPrismaClient(
      new PrismaClient({
        adapter: new PrismaPg({ connectionString }),
      }),
    );

    initDatabase(connectionString);
  } catch (err) {
    console.error('Is Docker running?');
    throw err;
  }
}, 30_000);

afterEach(async () => {
  await container?.stop();
});

function initDatabase(databaseUrl: string) {
  applyMigrations(databaseUrl);
}

function applyMigrations(databaseUrl: string) {
  execSync('npx --no prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });
}
