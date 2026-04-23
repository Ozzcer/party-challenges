import type { Attribute } from '@party/shared';
import { prisma } from '../lib/prisma.lib';

export async function listAttributes(): Promise<Attribute[]> {
  return prisma.attribute.findMany({ orderBy: { name: 'asc' } });
}
