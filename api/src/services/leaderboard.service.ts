import type { Leaderboard, ProtectedPlayer } from '@party/shared';
import { prisma } from '../lib/prisma.lib';
import { getCurrentGameEvent } from './game-event.service';

export async function getLeaderboards(): Promise<Leaderboard[]> {
  const event = await getCurrentGameEvent();
  if (!event) return [];

  const titles = await prisma.title.findMany({
    include: { requirements: true },
  });

  const leaderboards: Leaderboard[] = [];

  for (const title of titles) {
    const attributeIds = title.requirements.map((r) => r.attributeId);
    if (attributeIds.length === 0) continue;

    if (title.titleType === 'SINGLE_REQUIREMENT') {
      const scores = await prisma.playerAttributeScore.findMany({
        where: { attributeId: attributeIds[0], eventId: event.id },
        include: { player: true },
        orderBy: { score: 'desc' },
      });

      const players: ProtectedPlayer[] = scores.map((s) => {
        const { playerCode: _, ...protectedPlayer } = s.player;
        return protectedPlayer;
      });

      leaderboards.push({ title, players });
    } else {
      // MULTI_REQUIREMENT_AVERAGE — sort by average score across required attributes
      const scores = await prisma.playerAttributeScore.findMany({
        where: { attributeId: { in: attributeIds }, eventId: event.id },
        include: { player: true },
      });

      const playerTotals = new Map<number, { total: number; player: (typeof scores)[0]['player'] }>();
      for (const score of scores) {
        const existing = playerTotals.get(score.playerId);
        if (existing) {
          existing.total += score.score;
        } else {
          playerTotals.set(score.playerId, { total: score.score, player: score.player });
        }
      }

      const sorted = [...playerTotals.values()].sort((a, b) => b.total - a.total);

      const players: ProtectedPlayer[] = sorted.map(({ player }) => {
        const { playerCode: _, ...protectedPlayer } = player;
        return protectedPlayer;
      });

      leaderboards.push({ title, players });
    }
  }

  return leaderboards;
}
