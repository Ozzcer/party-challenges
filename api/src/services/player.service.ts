import type {
  Player,
  PlayerDetails,
  ProtectedPlayerDetails,
} from '@party/shared';
import { AppError } from '../lib/error-handler.lib';
import { prisma } from '../lib/prisma.lib';
import { protectedInstanceInclude } from './challenge-instance.service';
import { getCurrentGameEvent } from './game-event.service';

export const protectedPlayerSelect = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} as const;

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
            include: protectedInstanceInclude,
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

export async function getPlayerByCode(
  code: string,
  enrolledInCurrentEvent: boolean,
): Promise<number | null> {
  const player = await prisma.player.findUnique({
    where: {
      playerCode: code,
      ...(enrolledInCurrentEvent && {
        events: { some: { event: { current: true } } },
      }),
    },
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
): Promise<ProtectedPlayerDetails | null> {
  const player = await prisma.player.findUnique({
    where: {
      id: playerId,
    },
    select: {
      ...protectedPlayerSelect,
      playerAttributeScores: {
        include: { attribute: true },
      },
    },
  });
  if (!player) return null;

  return player;
}

export async function getPlayerCodeById(id: number): Promise<string | null> {
  const player = await prisma.player.findUnique({
    where: {
      id,
    },
    select: { playerCode: true },
  });
  return player?.playerCode || null;
}

export async function getPlayersIncludeActiveChallenge(
  playerIds: number[],
  eventId: number,
) {
  return await prisma.player.findMany({
    where: {
      id: { in: playerIds },
      events: {
        some: {
          event: {
            id: eventId,
          },
        },
      },
    },
    include: {
      challengeParticipation: {
        where: { status: 'OPEN' },
      },
    },
  });
}

export async function incrementPlayerAttributeScore(
  playerId: number,
  eventId: number,
  attributeId: number,
  score: number,
) {
  await prisma.playerAttributeScore.update({
    where: {
      playerId_attributeId_eventId: {
        attributeId,
        eventId,
        playerId,
      },
    },
    data: {
      score: { increment: score },
    },
  });
}
