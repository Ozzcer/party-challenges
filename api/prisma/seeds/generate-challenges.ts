import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import 'dotenv/config';
import { PrismaClient } from '../../src/generated/prisma/client';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

interface ChallengeCreateData {
    attributeId: number;
    description: string;
    type: "SOLO" | "ADVERSARIAL";
    score: number;
}
async function main() {
  await seedChallenges();
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


async function seedChallenges() {

  const whimsyChallenges: ChallengeCreateData[] = [
    {
      attributeId: 1,
      description: "Find out that person's favourite colour",
      type: 'SOLO' as const,
      score: 1,
    },
    {
      attributeId: 1,
      description: "Play a tune",
      type: 'SOLO' as const,
      score: 1,
    },
    {
      attributeId: 1,
      description: "Make up a poem",
      type: 'SOLO' as const,
      score: 1,
    },
    {
      attributeId: 1,
      description: "Make something beautiful",
      type: 'SOLO' as const,
      score: 1,
    },
    {
      attributeId: 1,
      description: "Make a new friend and introduce them to us",
      type: 'SOLO' as const,
      score: 1,
    },
    {
      attributeId: 1,
      description: "Deliver a message",
      type: 'SOLO' as const,
      score: 1,
    },
    {
      attributeId: 1,
      description: "Do the best dance with Bernie (The tree)",
      type: 'ADVERSARIAL' as const,
      score: 1,
    },
  ]

  const resilienceChallenges: ChallengeCreateData[] = [
    {
      attributeId: 2,
      description: 'Hold a plank for the longest',
      type: 'ADVERSARIAL' as const,
      score: 1,
    },
    {
      attributeId: 2,
      description: 'Compliment battle',
      type: 'ADVERSARIAL' as const,
      score: 1,
    },
    {
      attributeId: 2,
      description: 'Hardest punch bag hit',
      type: 'ADVERSARIAL' as const,
      score: 1,
    },
    {
      attributeId: 2,
      description: 'Staring contest',
      type: 'ADVERSARIAL' as const,
      score: 1,
    },
    {
      attributeId: 2,
      description:
        'Who can do the most of an activity of their choosing (i.e Press ups, star jumps, etc)',
      type: 'ADVERSARIAL' as const,
      score: 1,
    },
  ];

  const wisdomChallenges: ChallengeCreateData[] = [
    {
      attributeId: 3,
      description: 'Solve a riddle',
      type: 'SOLO' as const,
      score: 1,
    },
    {
      attributeId: 3,
      description: 'Learn an interesting fact about someone',
      type: 'SOLO' as const,
      score: 1,
    },
    {
      attributeId: 3,
      description: 'Answer a question',
      type: 'SOLO' as const,
      score: 1,
    },
    {
      attributeId: 3,
      description: 'What is in the box?',
      type: 'SOLO' as const,
      score: 1,
    },
    {
      attributeId: 3,
      description: 'Leave some words of wisdom for Yish (07459374266)',
      type: 'SOLO' as const,
      score: 1,
    },
    {
      attributeId: 3,
      description: 'Create a spaghetti tower',
      type: 'SOLO' as const,
      score: 1,
    },
    {
      attributeId: 3,
      description: 'Quickest answer to a maths question',
      type: 'ADVERSARIAL' as const,
      score: 1,
    },
    {
      attributeId: 3,
      description: 'Create a cocktail for us to review',
      type: 'SOLO',
      score: 1,
    },
  ];

  const challenges = [
    ...whimsyChallenges,
    ...resilienceChallenges,
    ...wisdomChallenges,
  ]

  await prisma.challenge.deleteMany();
  await prisma.challenge.createMany({ data: challenges });
  console.log('Challenges generated');
}
