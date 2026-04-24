import type {
  Challenge,
  ChallengeInstanceCreated,
  ChallengeStatus,
  Player,
  ProtectedChallengeInstanceDetails,
} from '@party/shared';
import { AppError } from '../lib/error-handler.lib';
import { prisma } from '../lib/prisma.lib';
import { getCurrentGameEvent } from './game-event.service';
import { protectedPlayerSelect } from './player.service';

export const protectedInstanceInclude = {
  participants: {
    include: {
      player: {
        select: protectedPlayerSelect,
      },
    },
  },
  challenge: {
    include: {
      attribute: true,
    },
  },
} as const;

export async function getActiveInstances(): Promise<
  ProtectedChallengeInstanceDetails[]
> {
  const event = await getCurrentGameEvent();
  if (!event) throw new AppError('No current game event', 400);

  const instances = await prisma.challengeInstance.findMany({
    where: {
      eventId: event.id,
      participants: { some: { status: 'OPEN' } },
    },
    include: protectedInstanceInclude,
  });

  return instances;
}

export async function getInstanceById(
  id: number,
): Promise<ProtectedChallengeInstanceDetails | null> {
  const instance = await prisma.challengeInstance.findUnique({
    where: { id },
    include: protectedInstanceInclude,
  });

  return instance;
}

export async function setParticipantsStatus(
  participantIds: number[],
  status: ChallengeStatus,
): Promise<void> {
  await prisma.challengeParticipant.updateMany({
    where: {
      id: { in: participantIds },
    },
    data: {
      status,
    },
  });
}

async function createInstance(
  challengeId: number,
  players: Player[],
  eventId: number,
): Promise<ChallengeInstanceCreated> {
  const instance = await prisma.challengeInstance.create({
    data: {
      challengeId,
      eventId,
      participants: {
        create: players.map((player) => ({ playerId: player.id })),
      },
    },
  });

  return { challengeInstance: instance, players };
}

export async function assignChallenge(
  challenge: Challenge,
  players: Player[],
  eventId: number,
): Promise<ChallengeInstanceCreated[]> {
  if (challenge.type === 'SOLO') {
    return Promise.all(
      players.map((player) => createInstance(challenge.id, [player], eventId)),
    );
  }

  return [await createInstance(challenge.id, players, eventId)];
}

export async function getPlayerChallengeInstances(
  playerId: number,
): Promise<ProtectedChallengeInstanceDetails[]> {
  return await prisma.challengeInstance.findMany({
    where: {
      event: { current: true },
      participants: { some: { playerId, NOT: { status: 'OPEN' } } },
    },
    include: protectedInstanceInclude,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPlayerCurrentChallengeInstance(
  playerId: number,
): Promise<ProtectedChallengeInstanceDetails | null> {
  return await prisma.challengeInstance.findFirst({
    where: {
      event: { current: true },
      participants: { some: { playerId, status: 'OPEN' } },
    },
    include: protectedInstanceInclude,
  });
}
