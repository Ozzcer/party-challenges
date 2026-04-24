import type { Leaderboard, ProtectedPlayer } from '@party/shared';
import { prisma } from '../lib/prisma.lib';
import { getCurrentGameEvent } from './game-event.service';

const TOP_COUNT = 10;

export async function getLeaderboards(
  playerId?: number,
): Promise<Leaderboard[]> {
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
      const attributeId = attributeIds[0];

      const scores = await prisma.playerAttributeScore.findMany({
        where: { attributeId, eventId: event.id },
        include: { player: true },
        orderBy: { score: 'desc' },
        take: TOP_COUNT,
      });

      const players: ProtectedPlayer[] = scores.map((s) => {
        const { playerCode: _, ...protectedPlayer } = s.player;
        return protectedPlayer;
      });

      let currentPlayerPosition: number | undefined;
      if (playerId) {
        const topIndex = players.findIndex((p) => p.id === playerId);
        if (topIndex !== -1) {
          currentPlayerPosition = topIndex + 1;
        } else {
          const playerScore = await prisma.playerAttributeScore.findUnique({
            where: {
              playerId_attributeId_eventId: {
                playerId,
                attributeId,
                eventId: event.id,
              },
            },
          });
          if (playerScore) {
            const playersAbove = await prisma.playerAttributeScore.count({
              where: {
                attributeId,
                eventId: event.id,
                score: { gt: playerScore.score },
              },
            });
            currentPlayerPosition = playersAbove + 1;
          }
        }
      }

      leaderboards.push({ title, players, currentPlayerPosition });
    } else {
      // MULTI_REQUIREMENT_AVERAGE — sort by average score across required attributes
      const scores = await prisma.playerAttributeScore.findMany({
        where: { attributeId: { in: attributeIds }, eventId: event.id },
        include: { player: true },
      });

      const playerTotals = new Map<
        number,
        { total: number; player: (typeof scores)[0]['player'] }
      >();
      for (const score of scores) {
        const existing = playerTotals.get(score.playerId);
        if (existing) {
          existing.total += score.score;
        } else {
          playerTotals.set(score.playerId, {
            total: score.score,
            player: score.player,
          });
        }
      }

      const sorted = [...playerTotals.values()].sort(
        (a, b) => b.total - a.total,
      );

      const players: ProtectedPlayer[] = sorted
        .slice(0, TOP_COUNT)
        .map(({ player }) => {
          const { playerCode: _, ...protectedPlayer } = player;
          return protectedPlayer;
        });

      let currentPlayerPosition: number | undefined;
      if (playerId) {
        const fullIndex = sorted.findIndex(
          ({ player }) => player.id === playerId,
        );
        currentPlayerPosition = fullIndex !== -1 ? fullIndex + 1 : undefined;
      }

      leaderboards.push({ title, players, currentPlayerPosition });
    }
  }

  return leaderboards;
}
