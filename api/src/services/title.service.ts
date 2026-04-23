import type { ProtectedTitle, TitleRequirement } from '@party/shared';
import { prisma } from '../lib/prisma.lib';
import { getCurrentGameEvent } from './game-event.service';

async function isSingleRequirementEarned(
  playerId: number,
  eventId: number,
  requirement: TitleRequirement,
): Promise<boolean> {
  const topScore = await prisma.playerAttributeScore.findFirst({
    where: {
      attributeId: requirement.attributeId,
      eventId,
      score: { gte: requirement.threshold },
    },
    orderBy: { score: 'desc' },
  });
  return topScore?.playerId === playerId;
}

async function isMultiRequirementEarned(
  playerId: number,
  eventId: number,
  requirements: TitleRequirement[],
): Promise<boolean> {
  const attributeIds = requirements.map(
    (requirement) => requirement.attributeId,
  );

  const [topPlayer] = await prisma.playerAttributeScore.groupBy({
    by: ['playerId'],
    where: { attributeId: { in: attributeIds }, eventId },
    _avg: { score: true },
    orderBy: { _avg: { score: 'desc' } },
    take: 1,
  });

  if (topPlayer?.playerId !== playerId) return false;

  const failingThreshold = await prisma.playerAttributeScore.findFirst({
    where: {
      playerId,
      eventId,
      OR: requirements.map((requirement) => ({
        attributeId: requirement.attributeId,
        score: { lt: requirement.threshold },
      })),
    },
  });

  return failingThreshold === null;
}

async function isTitleEarned(
  playerId: number,
  eventId: number,
  title: ProtectedTitle & { requirements: TitleRequirement[] },
): Promise<boolean> {
  if (title.requirements.length === 0) return false;

  switch (title.titleType) {
    case 'SINGLE_REQUIREMENT':
      return isSingleRequirementEarned(
        playerId,
        eventId,
        title.requirements[0],
      );
    case 'MULTI_REQUIREMENT_AVERAGE':
      return isMultiRequirementEarned(playerId, eventId, title.requirements);
  }
}

export async function getEarnedTitles(
  playerId: number,
): Promise<ProtectedTitle[]> {
  const event = await getCurrentGameEvent();
  if (!event) return [];

  const titles = await prisma.title.findMany({
    include: { requirements: true },
  });

  const results = await Promise.all(
    titles.map(async (title) => ({
      title,
      earned: await isTitleEarned(playerId, event.id, title),
    })),
  );

  return results.filter(({ earned }) => earned).map(({ title }) => title);
}
