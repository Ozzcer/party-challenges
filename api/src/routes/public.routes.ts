import { FastifyInstance } from 'fastify';
import { getLeaderboardsHandler } from '../controllers/leaderboard.controller';
import { publicAuthGuard } from '../hooks/public-auth.guard';

export async function publicRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.register(async (playerFastify) => {
    playerFastify.addHook('preHandler', publicAuthGuard);

    playerFastify.get('/leaderboards', getLeaderboardsHandler);
  });
}
