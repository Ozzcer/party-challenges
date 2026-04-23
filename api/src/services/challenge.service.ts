import type { Challenge } from '@party/shared';
import type { CreateChallenge } from '@party/shared';
import { prisma } from '../lib/prisma.lib';

export async function listChallenges(): Promise<Challenge[]> {
  return await prisma.challenge.findMany();
}

export async function createChallenge(data: CreateChallenge): Promise<Challenge> {
  return await prisma.challenge.create({ data });
}
