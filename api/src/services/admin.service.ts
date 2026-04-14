import { prisma } from '../lib/prisma';

export async function getOverview(): Promise<{ playerCount: number; challengeCount: number; challengeInstanceCount: number }> {
  const [playerCount, challengeCount, challengeInstanceCount] = await Promise.all([
    prisma.player.count({
      where: {
        name: {not: null} 
      }
    }),
    prisma.challenge.count(),
    prisma.challengeInstance.count(),
  ]);

  return { playerCount, challengeCount, challengeInstanceCount };
}
