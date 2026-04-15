import { ChallengeStatus, ChallengeType } from '../generated/prisma/enums';
import { AppError } from '../lib/app-error';
import { prisma } from '../lib/prisma';
import { getCurrentEvent } from './event.service';

export async function listAttributes() {
  return prisma.attribute.findMany({ orderBy: { name: 'asc' } });
}

export async function listChallenges() {
  return prisma.challenge.findMany({
    include: { attribute: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createChallenge(data: {
  description: string;
  score: number;
  type: ChallengeType;
  attributeId: number;
  custom?: boolean;
}) {
  return prisma.challenge.create({ data: { ...data, custom: data.custom ?? false } });
}

export async function getPlayerById(id: number) {
  const [player, currentEvent] = await Promise.all([
    prisma.player.findUnique({ where: { id } }),
    getCurrentEvent(),
  ]);

  if (!player) return null;

  const instance = currentEvent
    ? await prisma.challengeInstance.findFirst({
        where: {
          eventId: currentEvent.id,
          participants: { some: { playerId: player.id, status: ChallengeStatus.OPEN } },
        },
        include: {
          challenge: { include: { attribute: true } },
          participants: { include: { player: true } },
        },
      })
    : null;

  return { player, instance, activeEventId: currentEvent?.id ?? null };
}

export async function getPlayerByCode(code: string) {
  const [player, currentEvent] = await Promise.all([
    prisma.player.findUnique({ where: { playerCode: code } }),
    getCurrentEvent(),
  ]);

  if (!player) return null;

  const instance = currentEvent
    ? await prisma.challengeInstance.findFirst({
        where: {
          eventId: currentEvent.id,
          participants: { some: { playerId: player.id, status: ChallengeStatus.OPEN } },
        },
        include: {
          challenge: { include: { attribute: true } },
          participants: { include: { player: true } },
        },
      })
    : null;

  return { player, instance };
}

export async function validatePlayers(eventId: number, playerCodes: string[]) {
  const players = [];

  for (const code of playerCodes) {
    const player = await prisma.player.findUnique({ where: { playerCode: code } });
    if (!player) {
      throw new AppError(`Player '${code}' not found`, 404);
    }

    const enrolled = await prisma.gameEventPlayer.findUnique({
      where: { eventId_playerId: { eventId, playerId: player.id } },
    });
    if (!enrolled) {
      throw new AppError(`Player '${player.name ?? player.playerCode}' is not enrolled in this event`, 409);
    }

    const openInstance = await prisma.challengeInstance.findFirst({
      where: {
        eventId,
        participants: { some: { playerId: player.id, status: ChallengeStatus.OPEN } },
      },
    });
    if (openInstance) {
      throw new AppError(`Player '${player.name ?? player.playerCode}' already has an open challenge`, 409);
    }

    players.push(player);
  }

  return players;
}

export async function getAvailableChallenges(eventId: number, playerIds: number[], type: ChallengeType) {
  return prisma.challenge.findMany({
    where: {
      type,
      NOT: {
        instances: {
          some: {
            eventId,
            participants: {
              some: {
                playerId: { in: playerIds },
                status: ChallengeStatus.COMPLETED,
              },
            },
          },
        },
      },
    },
    include: { attribute: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createInstance(challengeId: number, eventId: number, playerIds: number[]) {
  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge) throw new AppError('Challenge not found', 404);

  if (challenge.type === ChallengeType.ADVERSARIAL && playerIds.length < 2) {
    throw new AppError('Adversarial challenges require at least 2 players', 400);
  }

  if (new Set(playerIds).size !== playerIds.length) {
    throw new AppError('Duplicate players are not allowed', 400);
  }

  // Enforce: no player can have more than one OPEN instance in this event
  for (const playerId of playerIds) {
    const existing = await prisma.challengeInstance.findFirst({
      where: {
        eventId,
        participants: { some: { playerId, status: ChallengeStatus.OPEN } },
      },
    });
    if (existing) {
      throw new AppError(`Player ${playerId} already has an open challenge in this event`, 409);
    }
  }

  return prisma.challengeInstance.create({
    data: {
      challengeId,
      eventId,
      participants: {
        create: playerIds.map((playerId) => ({ playerId, status: ChallengeStatus.OPEN })),
      },
    },
    include: {
      challenge: { include: { attribute: true } },
      participants: { include: { player: true } },
    },
  });
}

export async function getInstance(instanceId: number) {
  return prisma.challengeInstance.findUnique({
    where: { id: instanceId },
    include: {
      challenge: { include: { attribute: true } },
      participants: { include: { player: true } },
    },
  });
}

export async function resolveInstance(
  instanceId: number,
  results: Array<{ participantId: number; status: 'COMPLETED' | 'FAILED' }>,
) {
  const instance = await prisma.challengeInstance.findUnique({
    where: { id: instanceId },
    include: { challenge: { include: { attribute: true } }, participants: true },
  });

  if (!instance) throw new AppError('Instance not found', 404);

  await prisma.$transaction(async (tx) => {
    for (const result of results) {
      await tx.challengeParticipant.update({
        where: { id: result.participantId },
        data: { status: result.status },
      });

      if (result.status === ChallengeStatus.COMPLETED) {
        const participant = instance.participants.find((p) => p.id === result.participantId);
        if (!participant) continue;

        await tx.playerAttributeScore.upsert({
          where: {
            playerId_attributeId_eventId: {
              playerId: participant.playerId,
              attributeId: instance.challenge.attributeId,
              eventId: instance.eventId,
            },
          },
          create: {
            playerId: participant.playerId,
            attributeId: instance.challenge.attributeId,
            eventId: instance.eventId,
            score: instance.challenge.score,
          },
          update: {
            score: { increment: instance.challenge.score },
          },
        });
      }
    }
  });
}
