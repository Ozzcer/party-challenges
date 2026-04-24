import type {
  Leaderboard,
  ProtectedPlayer,
  ProtectedTitle,
  Title,
  TitleRequirement,
} from '@party/shared';
import { prisma } from '../lib/prisma.lib';
import { protectedPlayerSelect } from './player.service';

const TOP_COUNT = 10;

export async function getSingleAttributeLeaderboard(
  eventId: number,
  title: Title,
  requirement: TitleRequirement,
  playerId?: number,
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
          },
        },
      },
    },
    orderBy: {
      score: 'desc',
    },
    take: TOP_COUNT,
  });

  if (playerId) {
    const topIndex = scores.findIndex((score) => score.player.id === playerId);
    if (topIndex !== -1) {
      currentPlayerPosition = topIndex + 1;
    } else {
      const playerScore = await prisma.playerAttributeScore.findUnique({
        where: {
          playerId_attributeId_eventId: {
            attributeId: requirement.attributeId,
            playerId,
            eventId,
          },
        },
      });
      if (playerScore) {
        const playersAbove = await prisma.playerAttributeScore.count({
          where: {
            attributeId: requirement.attributeId,
            eventId: eventId,
            score: { gt: playerScore.score },
          },
        });
        currentPlayerPosition = playersAbove + 1;
        console.log(currentPlayerPosition);
      }
    }
  }

  return {
    title,
    players: scores.map((score) => score.player),
    currentPlayerPosition,
  };
}

export async function getMultiAttributeLeaderboard(
  eventId: number,
  title: ProtectedTitle,
  requirements: TitleRequirement[],
  playerId?: number,
) {
  const scores = await prisma.playerAttributeScore.findMany({
    where: {
      attributeId: {
        in: requirements.map((req) => req.attributeId),
      },
      eventId: eventId,
    },
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

  const sorted = [...playerTotals.values()].sort((a, b) => b.total - a.total);

  const players: ProtectedPlayer[] = sorted
    .slice(0, TOP_COUNT)
    .map(({ player }) => {
      const { playerCode: _, ...protectedPlayer } = player;
      return protectedPlayer;
    });

  let currentPlayerPosition: number | undefined;
  if (playerId) {
    const fullIndex = sorted.findIndex(({ player }) => player.id === playerId);
    currentPlayerPosition = fullIndex !== -1 ? fullIndex + 1 : undefined;
  }

  return { title, players, currentPlayerPosition };
}
