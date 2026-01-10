import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { faker } from '@faker-js/faker';
import nextEnv from '@next/env';

import { prisma } from '@/lib/server/db/prisma-client';

let { loadedEnvFiles } = nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV === 'development');
console.info(
  `[${path.basename(fileURLToPath(import.meta.url))}] Environments:`,
  loadedEnvFiles.map((f) => f.path).join(', '),
);

async function seedTodos() {
  await prisma.$transaction(async (tx) => {
    let currentDate = new Date();

    await tx.todo.createMany({
      data: [
        {
          title: faker.lorem.words(2),
          completed: faker.datatype.boolean(),
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        {
          title: faker.lorem.words(2),
          completed: faker.datatype.boolean(),
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        {
          title: faker.lorem.words(2),
          completed: faker.datatype.boolean(),
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ],
    });
  });
}

async function main() {
  await seedTodos();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
