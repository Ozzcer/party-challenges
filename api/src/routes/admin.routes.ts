import { FastifyInstance } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import {
  getActiveInstancesHandler,
  getInstanceHandler,
  resolveInstanceHandler,
} from '../controllers/challenge-instance.controller';
import { getChallenges, getUncompletedChallengesHandler, postChallenge } from '../controllers/challenge.controller';
import {
  getEarnedTitlesByIdHandler,
  getPlayerByCodeHandler,
  getPlayerByIdHandler,
  getPlayerCurrentChallengeByIdHandler,
  getUnusedPlayerCodesHandler,
  listPlayersHandler,
} from '../controllers/player.controller';
import { adminAuthGuard } from '../hooks/admin-auth.guard';
import {
  instanceIdParamsSchema,
  resolveChallengeBodySchema,
} from '../schema/challenge-instance.schema';
import { createChallengeBodySchema, uncompletedChallengesBodySchema } from '../schema/challenge.schema';
import { playerCodeParamsSchema, playerIdParamsSchema } from '../schema/player.schema';
import { getCurrentGameEvent } from '../services/game-event.service';
import type { ResolveChallenge } from '@party/shared';

export async function adminRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.register(async (adminFastify) => {
    adminFastify.addHook('preHandler', adminAuthGuard);

    adminFastify.get('/challenges', getChallenges);

    adminFastify.post<{ Body: FromSchema<typeof uncompletedChallengesBodySchema> }>(
      '/challenges/uncompleted',
      { schema: { body: uncompletedChallengesBodySchema } },
      getUncompletedChallengesHandler,
    );

    adminFastify.post<{ Body: FromSchema<typeof createChallengeBodySchema> }>(
      '/challenges',
      { schema: { body: createChallengeBodySchema } },
      postChallenge,
    );

    adminFastify.get('/challenge-instances/active', getActiveInstancesHandler);

    adminFastify.get<{ Params: FromSchema<typeof instanceIdParamsSchema> }>(
      '/challenge-instances/:id',
      { schema: { params: instanceIdParamsSchema } },
      getInstanceHandler,
    );

    adminFastify.post<{
      Params: FromSchema<typeof instanceIdParamsSchema>;
      Body: ResolveChallenge;
    }>(
      '/challenge-instances/:id/resolve',
      { schema: { params: instanceIdParamsSchema, body: resolveChallengeBodySchema } },
      resolveInstanceHandler,
    );

    adminFastify.get('/current-event', async (_request, reply) => {
      const event = await getCurrentGameEvent();
      reply.send(event);
    });

    adminFastify.get('/players', listPlayersHandler);

    adminFastify.get<{ Params: FromSchema<typeof playerIdParamsSchema> }>(
      '/player/:id',
      { schema: { params: playerIdParamsSchema } },
      getPlayerByIdHandler,
    );

    adminFastify.get<{ Params: FromSchema<typeof playerCodeParamsSchema> }>(
      '/player-by-code/:code',
      { schema: { params: playerCodeParamsSchema } },
      getPlayerByCodeHandler,
    );

    adminFastify.get('/unused-player-codes', getUnusedPlayerCodesHandler);

    adminFastify.get<{ Params: FromSchema<typeof playerIdParamsSchema> }>(
      '/players/:id/challenge',
      { schema: { params: playerIdParamsSchema } },
      getPlayerCurrentChallengeByIdHandler,
    );

    adminFastify.get<{ Params: FromSchema<typeof playerIdParamsSchema> }>(
      '/players/:id/titles',
      { schema: { params: playerIdParamsSchema } },
      getEarnedTitlesByIdHandler,
    );
  });
}
