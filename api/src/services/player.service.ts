import type {
  Player,
  PlayerDetails,
  ProtectedChallengeInstanceDetails,
  ProtectedPlayer,
} from '@party/shared';
import { AppError } from '../lib/error-handler.lib';
import { prisma } from '../lib/prisma.lib';
import { getCurrentGameEvent } from './game-event.service';

export async function listPlayersInCurrentEvent(): Promise<Player[]> {
  const event = await getCurrentGameEvent();
  if (!event) throw new AppError('No current game event', 400);

  const eventPlayers = await prisma.gameEventPlayer.findMany({
    where: { eventId: event.id },
    include: { player: true },
  });

  return eventPlayers.map((ep) => ep.player);
}

export async function getPlayerById(id: number): Promise<PlayerDetails | null> {
  const event = await getCurrentGameEvent();

  return await prisma.player.findUnique({
    where: { id },
    include: {
      challengeParticipation: {
        where: event ? { instance: { eventId: event.id } } : undefined,
        include: {
          instance: {
            include: {
              challenge: true,
              participants: {
                include: {
                  player: {
                    select: {
                      id: true,
                      name: true,
                      createdAt: true,
                      updatedAt: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      playerAttributeScores: {
        where: event ? { eventId: event.id } : undefined,
        include: { attribute: true },
      },
    },
  });
}

export async function getPlayerByCode(code: string): Promise<number | null> {
  const player = await prisma.player.findUnique({
    where: { playerCode: code },
    select: { id: true },
  });
  return player?.id ?? null;
}

export async function getUnusedPlayerCodes(): Promise<string[]> {
  const players = await prisma.player.findMany({
    where: { name: null },
    select: { playerCode: true },
  });
  return players.map((p) => p.playerCode);
}

export async function setPlayerName(
  playerId: number,
  name: string,
): Promise<void> {
  await prisma.player.update({ where: { id: playerId }, data: { name } });
}

export async function isPlayerEnrolled(playerId: number): Promise<boolean> {
  const event = await getCurrentGameEvent();
  if (!event) return false;

  const enrollment = await prisma.gameEventPlayer.findFirst({
    where: { playerId, eventId: event.id },
  });
  return enrollment !== null;
}

export async function getPlayerDetails(
  playerId: number,
): Promise<ProtectedPlayer | null> {
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player) return null;

  const { playerCode: _, ...protectedPlayer } = player;
  return protectedPlayer;
}

export async function getPlayerChallenges(
  playerId: number,
): Promise<ProtectedChallengeInstanceDetails[]> {
  const event = await getCurrentGameEvent();
  if (!event) throw new AppError('No current game event', 400);

  const participants = await prisma.challengeParticipant.findMany({
    where: { playerId, instance: { eventId: event.id } },
    include: {
      instance: {
        include: {
          challenge: true,
          participants: {
            include: {
              player: {
                select: {
                  id: true,
                  name: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return participants.map((p) => p.instance);
}

export async function getPlayerCurrentChallenge(
  playerId: number,
): Promise<ProtectedChallengeInstanceDetails | null> {
  const event = await getCurrentGameEvent();
  if (!event) return null;

  const participant = await prisma.challengeParticipant.findFirst({
    where: { playerId, status: 'OPEN', instance: { eventId: event.id } },
    include: {
      instance: {
        include: {
          challenge: true,
          participants: {
            include: {
              player: {
                select: {
                  id: true,
                  name: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!participant) return null;
  return participant.instance;
}
