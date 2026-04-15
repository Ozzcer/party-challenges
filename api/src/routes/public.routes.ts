import { FastifyInstance } from 'fastify';
import { publicAuthGuard } from '../lib/public-auth.guard';

export async function publicRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.register(async (playerFastify) => {
    playerFastify.addHook('preHandler', publicAuthGuard);

  });
}
