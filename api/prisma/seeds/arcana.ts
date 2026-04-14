import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";
import { PrismaClient } from '../../src/generated/prisma/client';
import { hash } from '../../src/lib/hashing.lib';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {

  const attributes = [
    {
      name: 'Whimsy',
      description:
        'The ability to approach opportunities with curiosity and an open mind. Reward creative thinking, playfulness, and community spirit.',
    },
    {
      name: 'Resilience',
      description:
        'The ability to push through difficult challenges. Reward feats of strength, endurance, and determination.',
    },
    {
      name: 'Wisdom',
      description:
        'The ability to approach challenges thoughtfully and pragmatically. Reward perception, intellect, and sound judgement.',
    },
  ];
  for (const attribute of attributes) {
    await prisma.attribute.create({ data: attribute });
  }

  const challenges = [
    { attributeId: 1, description: "Find out that person's favourite colour", type: 'SOLO' as const, score: 1 },
    { attributeId: 2, description: 'Hold a plank for the longest', type: 'ADVERSARIAL' as const, score: 2 },
    { attributeId: 3, description: 'Solve the riddle', type: 'SOLO' as const, score: 3 },
  ];

  for (const challenge of challenges) {
    await prisma.challenge.create({ data: challenge });
  }

  await prisma.admin.create({
    data: {
      username: 'arcana',
      password: await hash(process.env.ADMIN_SEED_PASSWORD!),
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });