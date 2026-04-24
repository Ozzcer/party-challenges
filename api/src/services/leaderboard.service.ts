import type {
  Leaderboard,
  ProtectedPlayerDetails,
  ProtectedTitleDetails,
  TitleRequirement,
} from '@party/shared';
import { prisma } from '../lib/prisma.lib';
import { protectedPlayerSelect } from './player.service';

const TOP_COUNT = 10;

export async function getSingleAttributeLeaderboard(
  eventId: number,
  title: ProtectedTitleDetails,
  requirement: TitleRequirement,
  currentPlayer: ProtectedPlayerDetails | null,
): Promise<Leaderboard> {
  let currentPlayerPosition: number | undefined = undefined;
  const scores = await prisma.playerAttributeScore.findMany({
    where: {
      attributeId: requirement.attributeId,
      eventId,
    },
    include: {
      player: {
        select: {
          ...protectedPlayerSelect,
          playerAttributeScores: {
            where: { eventId },
            include: {
              attribute: true,
            },
            orderBy: {
              attributeId: 'asc',
            },
          },
        },
      },
    },
    orderBy: [{ score: 'desc' }, { updatedAt: 'asc' }],
    take: TOP_COUNT,
  });

  if (currentPlayer) {
    const topIndex = scores.findIndex(
      (score) => score.player.id === currentPlayer.id,
    );
    if (topIndex !== -1) {
      currentPlayerPosition = topIndex + 1;
    } else {
      const playerScore = await prisma.playerAttributeScore.findUnique({
        where: {
          playerId_attributeId_eventId: {
            attributeId: requirement.attributeId,
            playerId: currentPlayer.id,
            eventId,
          },
        },
      });
      if (playerScore) {
        const playersAbove = await prisma.playerAttributeScore.count({
          where: {
            attributeId: requirement.attributeId,
            eventId: eventId,
            OR: [
              { score: { gt: playerScore.score } },
              {
                score: playerScore.score,
                updatedAt: { lt: playerScore.updatedAt },
              },
            ],
          },
        });
        currentPlayerPosition = playersAbove + 1;
      }
    }
  }

  return {
    title,
    players: scores.map((score) => score.player),
    currentPlayerPosition,
    currentPlayer,
  };
}

export async function getMultiAttributeLeaderboard(
  eventId: number,
  title: ProtectedTitleDetails,
  requirements: TitleRequirement[],
  currentPlayer: ProtectedPlayerDetails | null,
): Promise<Leaderboard> {
  const scores = await prisma.playerAttributeScore.findMany({
    where: {
      attributeId: {
        in: requirements.map((req) => req.attributeId),
      },
      eventId: eventId,
    },
    include: {
      player: {
        select: {
          ...protectedPlayerSelect,
          playerAttributeScores: {
            where: {
              eventId,
            },
            include: {
              attribute: true,
            },
            orderBy: {
              attributeId: 'asc',
            },
          },
        },
      },
    },
  });

  const playerTotals = new Map<
    number,
    { total: number; maxUpdatedAt: Date; player: (typeof scores)[0]['player'] }
  >();
  for (const score of scores) {
    const existing = playerTotals.get(score.playerId);
    if (existing) {
      existing.total += score.score;
      if (score.updatedAt > existing.maxUpdatedAt) {
        existing.maxUpdatedAt = score.updatedAt;
      }
    } else {
      playerTotals.set(score.playerId, {
        total: score.score,
        maxUpdatedAt: score.updatedAt,
        player: score.player,
      });
    }
  }

  const sorted = [...playerTotals.values()].sort(
    (a, b) => b.total - a.total || a.maxUpdatedAt.getTime() - b.maxUpdatedAt.getTime(),
  );

  const players = sorted.slice(0, TOP_COUNT).map((item) => item.player);

  let currentPlayerPosition: number | undefined;
  if (currentPlayer) {
    const fullIndex = sorted.findIndex(
      ({ player }) => player.id === currentPlayer.id,
    );
    currentPlayerPosition = fullIndex !== -1 ? fullIndex + 1 : undefined;
  }

  return { title, players, currentPlayerPosition, currentPlayer };
}
