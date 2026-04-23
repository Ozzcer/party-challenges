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
      const topScore = await prisma.playerAttributeScore.findFirst({
        where: { attributeId: attributeIds[0], eventId: event.id },
        orderBy: { score: 'desc' },
      });

      if (topScore?.playerId === playerId) {
        earnedTitles.push(title);
      }
    } else {
      // MULTI_REQUIREMENT_AVERAGE — holder is the player with the highest average score
      const scores = await prisma.playerAttributeScore.findMany({
        where: { attributeId: { in: attributeIds }, eventId: event.id },
      });

      const playerTotals = new Map<number, number>();
      for (const score of scores) {
        playerTotals.set(score.playerId, (playerTotals.get(score.playerId) ?? 0) + score.score);
      }

      let topPlayerId: number | null = null;
      let topAverage = -1;
      for (const [pid, total] of playerTotals.entries()) {
        const avg = total / attributeIds.length;
        if (avg > topAverage) {
          topAverage = avg;
          topPlayerId = pid;
        }
      }

      if (topPlayerId === playerId) {
        earnedTitles.push(title);
      }
    }
  }

  return earnedTitles;
}
