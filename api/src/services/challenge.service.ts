import type {
  Challenge,
  ChallengeDetails,
  CreateChallenge,
} from '@party/shared';
import { prisma } from '../lib/prisma.lib';
import { getCurrentGameEvent } from './game-event.service';

export async function getChallengeById(id: number): Promise<Challenge | null> {
  return await prisma.challenge.findUnique({ where: { id } });
}

export async function listChallenges(): Promise<ChallengeDetails[]> {
  return await prisma.challenge.findMany({
    include: {
      attribute: true,
    },
  });
}

export async function createChallenge(
  data: CreateChallenge,
): Promise<Challenge> {
  return await prisma.challenge.create({ data });
}

export async function getUncompletedChallengesForPlayers(
  playerIds: number[],
): Promise<ChallengeDetails[]> {
  const event = await getCurrentGameEvent();
  if (!event) return [];

  return await prisma.challenge.findMany({
    include: {
      attribute: true,
    },
    where: {
      NOT: {
        instances: {
          some: {
            eventId: event.id,
            participants: {
              some: { playerId: { in: playerIds } },
            },
          },
        },
      },
    },
  });
}
