import { execSync } from 'node:child_process';

import { PrismaPg } from '@prisma/adapter-pg';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { afterEach, beforeEach, vi } from 'vitest';

import { PrismaClient } from '@/lib/server/db/prisma/.generated/client';
import { setPrismaClient } from '@/lib/server/db/prisma-client';

vi.mock('next/server');
vi.mock('next/cache');
vi.mock('next/navigation');

let container: StartedPostgreSqlContainer;
const PG_VERSION = '17-alpine';
let containerImage = `postgres:${PG_VERSION}`;

beforeEach(async () => {
  container = await new PostgreSqlContainer(containerImage).start();
  let connectionString = container.getConnectionUri();

  setPrismaClient(
    new PrismaClient({
      adapter: new PrismaPg({ connectionString }),
    }),
  );

  initDatabase(connectionString);
}, 30_000);

afterEach(async () => {
  await container?.stop();
});

function initDatabase(databaseUrl: string) {
  applyMigrations(databaseUrl);
  seedDatabase(databaseUrl);
}

function applyMigrations(databaseUrl: string) {
  execSync('npx --no prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });
}

function seedDatabase(databaseUrl: string) {
  execSync('npx --no prisma db seed', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });
}
