import { execSync } from 'node:child_process';

import { PrismaClient } from '@prisma/client';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { afterEach, beforeEach, vi } from 'vitest';

import { setPrismaClient } from '@/lib/server/db/prisma/prisma-client';

vi.mock('next/server');
vi.mock('next/cache');
vi.mock('next/navigation');

let container: StartedPostgreSqlContainer;
const PG_VERSION = '16';
let containerImage = `postgres:${PG_VERSION}`;

beforeEach(async () => {
  container = await new PostgreSqlContainer(containerImage).start();
  setPrismaClient(new PrismaClient({ datasourceUrl: container.getConnectionUri() }));

  let databaseUrl = container.getConnectionUri();
  initDatabase(databaseUrl);
});

afterEach(async () => {
  await container.stop();
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
