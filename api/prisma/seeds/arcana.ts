import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import 'dotenv/config';
import { PrismaClient } from '../../src/generated/prisma/client';
import { TitleCreateInput } from '../../src/generated/prisma/models';
import { hash } from '../../src/lib/hashing.lib';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await seedEvent();
  await seedAttributes();
  await seedChallenges();
  await seedAdmins();
  await seedPlayers();
  await seedTitles();
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

async function seedEvent() {
  await prisma.gameEvent.create({
    data: {
      current: true,
      description: 'Launch Party',
      name: 'What came before',
    },
  });
}

async function seedAttributes() {
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
}

async function seedChallenges() {
  const challenges = [
    {
      attributeId: 1,
      description: "Find out that person's favourite colour",
      type: 'SOLO' as const,
      score: 1,
    },
    {
      attributeId: 2,
      description: 'Hold a plank for the longest',
      type: 'ADVERSARIAL' as const,
      score: 2,
    },
    {
      attributeId: 3,
      description: 'Solve the riddle',
      type: 'SOLO' as const,
      score: 3,
    },
  ];

  for (const challenge of challenges) {
    await prisma.challenge.create({ data: challenge });
  }
}

async function seedAdmins() {
  await prisma.admin.create({
    data: {
      username: 'arcana',
      password: await hash(process.env.ADMIN_SEED_PASSWORD!),
    },
  });
}

async function seedPlayers() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const usedCodes = new Set<string>();

  function generatePlayerCode(): string {
    let code: string;
    do {
      code = Array.from(
        { length: 5 },
        () => chars[Math.floor(Math.random() * chars.length)],
      ).join('');
    } while (usedCodes.has(code));
    usedCodes.add(code);
    return code;
  }

  for (let i = 0; i < 100; i++) {
    const player = await prisma.player.create({
      data: { playerCode: generatePlayerCode() },
    });
    if (i === 0) {
      console.log(`First player created: ${player.playerCode}`);
    }
  }
}

async function seedTitles() {
  const titles: TitleCreateInput[] = [
    {
      description: 'whimsy',
      name: 'whimsy',
      titleType: 'SINGLE_REQUIREMENT',
      imageUrl: '/images/moon.png',
      requirements: {
        create: [
          {
            attributeId: 1,
            threshold: 1,
          },
        ],
      },
    },
    {
      description: 'res',
      name: 'res',
      titleType: 'SINGLE_REQUIREMENT',
      imageUrl: '/images/strength.png',
      requirements: {
        create: [
          {
            attributeId: 2,
            threshold: 1,
          },
        ],
      },
    },
    {
      description: 'wis',
      name: 'wis',
      titleType: 'SINGLE_REQUIREMENT',
      imageUrl: '/images/hermit.png',
      requirements: {
        create: [
          {
            attributeId: 3,
            threshold: 1,
          },
        ],
      },
    },
    {
      description: 'avg',
      name: 'avg',
      titleType: 'MULTI_REQUIREMENT_AVERAGE',
      imageUrl: '/images/star.png',
      requirements: {
        create: [
          {
            attributeId: 1,
            threshold: 1,
          },
          {
            attributeId: 2,
            threshold: 1,
          },
          {
            attributeId: 3,
            threshold: 1,
          },
        ],
      },
    },
  ];

  for (const title of titles) {
    await prisma.title.create({
      data: title,
    });
  }
}
