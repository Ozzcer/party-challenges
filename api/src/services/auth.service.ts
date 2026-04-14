import type { Admin, Player } from '../generated/prisma/client';
import { compareHash } from '../lib/hashing.lib';
import { prisma } from '../lib/prisma';

export async function playerLogin(playerCode: string): Promise<Player | null> {
  return prisma.player.findFirst({
    where: { playerCode },
  });
}

export async function adminLogin(username: string, password: string): Promise<Admin | null> {
  const admin = await prisma.admin.findFirst({
    where: {
      username: username.toLowerCase(),
    }
  });

  if (!admin) {
    return null; 
  }

  return await compareHash(password, admin.password) ? admin : null;
}