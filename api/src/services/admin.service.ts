import { GameEvent } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';
import { getCurrentEvent } from './event.service';

export async function getOverview(): Promise<AdminOverview> {
  const [totalEventCount, totalPlayerCount, totalChallengeCount, currentEvent] = await Promise.all([
    prisma.gameEvent.count(),
    prisma.player.count(),
    prisma.challenge.count(),
    getCurrentEvent(),
  ]);

  if (!currentEvent) {
    return { totalEventCount, totalPlayerCount, totalChallengeCount };
  }

  const [currentEventPlayerCount, currentEventChallengeInstanceCount] = await Promise.all([
    prisma.gameEventPlayer.count({ where: { eventId: currentEvent.id, player: { name: { not: null } } } }),
    prisma.challengeInstance.count({ where: { eventId: currentEvent.id } }),
  ]);

  return {
    totalEventCount,
    totalPlayerCount,
    totalChallengeCount,
    currentEvent,
    currentEventPlayerCount,
    currentEventChallengeInstanceCount,
  };
}

export interface AdminOverview {
  totalEventCount: number;
  totalPlayerCount: number;
  totalChallengeCount: number;
  currentEvent?: GameEvent;
  currentEventPlayerCount?: number;
  currentEventChallengeInstanceCount?: number;
}
