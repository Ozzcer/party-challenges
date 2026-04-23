import { FastifyInstance } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import {
  getPlayerChallengesHandler,
  getPlayerCurrentChallengeHandler,
  getPlayerDetailsHandler,
  isEnrolledHandler,
  setNameHandler,
} from '../controllers/player.controller';
import { getPlayerTitlesHandler } from '../controllers/title.controller';
import { playerAuthGuard } from '../hooks/player-auth.guard';
import { setNameBodySchema } from '../schema/player.schema';

export async function playerRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.register(async (playerFastify) => {
    playerFastify.addHook('preHandler', playerAuthGuard);

    playerFastify.post<{ Body: FromSchema<typeof setNameBodySchema> }>(
      '/set-name',
      { schema: { body: setNameBodySchema } },
      setNameHandler,
    );

    playerFastify.get('/is-enrolled', isEnrolledHandler);

    playerFastify.get('/details', getPlayerDetailsHandler);

    playerFastify.get('/challenges', getPlayerChallengesHandler);

    playerFastify.get('/current-challenge', getPlayerCurrentChallengeHandler);

    playerFastify.get('/titles', getPlayerTitlesHandler);
  });
}
