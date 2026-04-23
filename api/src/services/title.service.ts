import type { ProtectedTitle } from '@party/shared';
import { prisma } from '../lib/prisma.lib';
import { getCurrentGameEvent } from './game-event.service';

export async function getEarnedTitles(playerId: number): Promise<ProtectedTitle[]> {
  const event = await getCurrentGameEvent();
  if (!event) return [];

  const titles = await prisma.title.findMany({
    include: { requirements: true },
  });

  const earnedTitles: ProtectedTitle[] = [];

  for (const title of titles) {
    const attributeIds = title.requirements.map((r) => r.attributeId);
    if (attributeIds.length === 0) continue;

    if (title.titleType === 'SINGLE_REQUIREMENT') {
      const threshold = title.requirements[0].threshold;
      const topScore = await prisma.playerAttributeScore.findFirst({
        where: {
          attributeId: attributeIds[0],
          eventId: event.id,
          score: { gte: threshold },
        },
        orderBy: { score: 'desc' },
      });

      if (topScore?.playerId === playerId) {
        earnedTitles.push(title);
      }
    } else {
      const [topPlayer] = await prisma.playerAttributeScore.groupBy({
        by: ['playerId'],
        where: { attributeId: { in: attributeIds }, eventId: event.id },
        _avg: { score: true },
        orderBy: { _avg: { score: 'desc' } },
        take: 1,
      });

      if (topPlayer?.playerId !== playerId) continue;

      const failingThreshold = await prisma.playerAttributeScore.findFirst({
        where: {
          playerId,
          eventId: event.id,
          OR: title.requirements.map((requirement) => ({
            attributeId: requirement.attributeId,
            score: { lt: requirement.threshold },
          })),
        },
      });

      if (!failingThreshold) earnedTitles.push(title);
    }
  }

  return earnedTitles;
}
