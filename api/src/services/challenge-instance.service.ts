import type { ChallengeInstance, ResolveChallenge, WithRequired } from '@party/shared';
import { AppError } from '../lib/error-handler.lib';
import { prisma } from '../lib/prisma.lib';
import { getCurrentGameEvent } from './game-event.service';

const instanceInclude = {
  participants: { include: { player: true } },
  challenge: true,
} as const;

export async function getActiveInstances(): Promise<
  WithRequired<ChallengeInstance, 'participants' | 'challenge'>[]
> {
  const event = await getCurrentGameEvent();
  if (!event) throw new AppError('No current game event', 400);

  const instances = await prisma.challengeInstance.findMany({
    where: {
      eventId: event.id,
      participants: { some: { status: 'OPEN' } },
    },
    include: instanceInclude,
  });

  return instances as WithRequired<ChallengeInstance, 'participants' | 'challenge'>[];
}

export async function getInstanceById(
  id: number,
): Promise<WithRequired<ChallengeInstance, 'participants' | 'challenge'> | null> {
  const instance = await prisma.challengeInstance.findUnique({
    where: { id },
    include: instanceInclude,
  });

  return instance as WithRequired<ChallengeInstance, 'participants' | 'challenge'> | null;
}

export async function resolveInstance(
  id: number,
  data: ResolveChallenge,
): Promise<ChallengeInstance> {
  const instance = await prisma.challengeInstance.findUnique({
    where: { id },
    include: { participants: true, challenge: true },
  });

  if (!instance) throw new AppError('Challenge instance not found', 404);

  const openParticipants = instance.participants.filter((p) => p.status === 'OPEN');

  if (data.status === 'FAILED') {
    await prisma.challengeParticipant.updateMany({
      where: { instanceId: id, status: 'OPEN' },
      data: { status: 'FAILED' },
    });
  } else {
    const winnerId = data.winningPlayer ?? openParticipants[0]?.playerId;
    if (winnerId === undefined) throw new AppError('No open participants to resolve', 400);

    await prisma.challengeParticipant.updateMany({
      where: { instanceId: id, status: 'OPEN', NOT: { playerId: winnerId } },
      data: { status: 'FAILED' },
    });
    await prisma.challengeParticipant.updateMany({
      where: { instanceId: id, playerId: winnerId },
      data: { status: 'COMPLETED' },
    });

    await prisma.playerAttributeScore.upsert({
      where: {
        playerId_attributeId_eventId: {
          playerId: winnerId,
          attributeId: instance.challenge.attributeId,
          eventId: instance.eventId,
        },
      },
      update: { score: { increment: instance.challenge.score } },
      create: {
        playerId: winnerId,
        attributeId: instance.challenge.attributeId,
        eventId: instance.eventId,
        score: instance.challenge.score,
      },
    });
  }

  return (await prisma.challengeInstance.findUnique({ where: { id } })) as ChallengeInstance;
}
