import { prisma } from '../lib/prisma';

export async function setPlayerName(playerId: number, name: string): Promise<void> {
  await prisma.player.update({
    where: { id: playerId },
    data: { name },
  });
}
