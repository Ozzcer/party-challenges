import { GameEvent } from '@party/shared';
import { AppError } from '../lib/error-handler.lib';
import { prisma } from '../lib/prisma.lib';

export async function getCurrentGameEvent(): Promise<GameEvent | null> {
  return await prisma.gameEvent.findFirst({
    where: {
      current: true,
    },
  });
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
          player: true
        },
        where: {
          playerId
        }
      },
    },
  });

  if (!event) throw new AppError('No current game event', 400);

  if (event.players.length === 0) {
    await prisma.gameEventPlayer.create({
      data: {
        playerId,
        eventId: event.id,
      },
    });
  }
}
