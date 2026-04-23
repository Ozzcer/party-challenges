import { CurrentGameEvent } from '@party/shared';
import { AppError } from '../lib/error-handler.lib';
import { prisma } from '../lib/prisma.lib';

export async function getCurrentGameEvent(): Promise<CurrentGameEvent | null> {
  const gameEvent = await prisma.gameEvent.findFirst({
    where: {
      current: true,
    },
    include: {
      _count: {
        select: {
          players: true,
          challengeInstances: true,
        },
      },
    },
  });

  if (!gameEvent) return null;

  return {
    ...gameEvent,
    current: true,
    totalChallengeInstances: gameEvent._count.challengeInstances,
    totalPlayers: gameEvent._count.players,
  };
}

export async function enrollInCurrentGameEvent(
  playerId: number,
): Promise<void> {
  const event = await prisma.gameEvent.findFirst({
    where: {
      current: true,
    },
    include: {
      players: {
        include: {
          player: true,
        },
        where: {
          playerId,
        },
      },
    },
  });

  if (!event) throw new AppError('No current game event', 400);

  if (event.players.length === 0) {
    const attributes = await prisma.attribute.findMany({ select: { id: true } });

    await prisma.gameEventPlayer.create({
      data: { playerId, eventId: event.id },
    });

    await prisma.playerAttributeScore.createMany({
      data: attributes.map((attribute) => ({
        playerId,
        attributeId: attribute.id,
        eventId: event.id,
        score: 0,
      })),
    });
  }
}
