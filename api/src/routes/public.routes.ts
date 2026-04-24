import { FastifyInstance } from 'fastify';
import { getLeaderboardHandler } from '../controllers/leaderboard.controller';
import { getAllTitlesHandler } from '../controllers/title.controller';
import { publicAuthGuard } from '../hooks/public-auth.guard';
import { leaderboardTitleIdSchema } from '../schema/leaderboard.schema';

export async function publicRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.register(async (publicFastify) => {
    publicFastify.addHook('preHandler', publicAuthGuard);

    publicFastify.get(
      '/leaderboards/:id',
      { schema: { params: leaderboardTitleIdSchema } },
      getLeaderboardHandler,
    );

    publicFastify.get('/titles', getAllTitlesHandler);
  });
}
