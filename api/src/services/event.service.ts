import { prisma } from '../lib/prisma';

export async function createEvent(data: { name: string; description: string; current: boolean }) {
  if (data.current) {
    return prisma.$transaction(async (tx) => {
      await tx.gameEvent.updateMany({ where: { current: true }, data: { current: false } });
      return tx.gameEvent.create({ data });
    });
  }
  return prisma.gameEvent.create({ data });
}

export async function listEvents() {
  return prisma.gameEvent.findMany({
    include: {
      _count: { select: { players: true, challengeInstances: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getEvent(id: number) {
  return prisma.gameEvent.findUnique({
    where: { id },
    include: {
      players: { include: { player: true } },
      challengeInstances: { include: { participants: true, challenge: true } },
    },
  });
}

export async function getCurrentEvent() {
  return prisma.gameEvent.findFirst({ where: { current: true } });
}

export async function updateEvent(id: number, data: { name?: string; description?: string; current?: boolean }) {
  if (data.current) {
    return prisma.$transaction(async (tx) => {
      await tx.gameEvent.updateMany({ where: { current: true }, data: { current: false } });
      return tx.gameEvent.update({ where: { id }, data });
    });
  }
  return prisma.gameEvent.update({ where: { id }, data });
}

export async function enrollPlayerInCurrentEvent(playerId: number): Promise<boolean> {
  const currentEvent = await getCurrentEvent();
  if (!currentEvent) return false;

  await prisma.gameEventPlayer.upsert({
    where: { eventId_playerId: { eventId: currentEvent.id, playerId } },
    create: { eventId: currentEvent.id, playerId },
    update: {},
  });

  return true;
}
