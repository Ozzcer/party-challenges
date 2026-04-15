import { FastifyInstance } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { adminAuthGuard } from '../lib/admin-auth.guard';
import { getOverview } from '../services/admin.service';
import { createEvent, getEvent, listEvents, updateEvent } from '../services/event.service';
import {
  createChallenge,
  createInstance,
  getAvailableChallenges,
  getInstance,
  getPlayerByCode,
  getPlayerById,
  listAttributes,
  listChallenges,
  resolveInstance,
  validatePlayers,
} from '../services/challenge.service';
import { eventCreateSchema } from '../schema/event-create.schema';
import { eventUpdateSchema } from '../schema/event-update.schema';
import { challengeCreateSchema } from '../schema/challenge-create.schema';
import { instanceCreateSchema } from '../schema/instance-create.schema';
import { instanceResolveSchema } from '../schema/instance-resolve.schema';
import { ChallengeType } from '../generated/prisma/enums';
import { AppError } from '../lib/app-error';

export async function adminRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.register(async (adminFastify) => {
    adminFastify.addHook('preHandler', adminAuthGuard);

    adminFastify.get('/overview', async (_request, reply) => {
      const overview = await getOverview();
      reply.send(overview);
    });

    // Events
    adminFastify.post('/events', async (request, reply) => {
      const { name, description, current = false } = request.body as FromSchema<typeof eventCreateSchema>;
      const event = await createEvent({ name, description, current });
      reply.status(201).send(event);
    });

    adminFastify.get('/events', async (_request, reply) => {
      const events = await listEvents();
      reply.send(events);
    });

    adminFastify.get('/events/:id', async (request, reply) => {
      const { id } = request.params as { id: string };
      const event = await getEvent(Number(id));
      if (!event) return reply.status(404).send({ error: 'Event not found' });
      reply.send(event);
    });

    adminFastify.patch('/events/:id', async (request, reply) => {
      const { id } = request.params as { id: string };
      const data = request.body as FromSchema<typeof eventUpdateSchema>;
      const existing = await getEvent(Number(id));
      if (!existing) return reply.status(404).send({ error: 'Event not found' });
      const event = await updateEvent(Number(id), data);
      reply.send(event);
    });

    // Player validation + available challenges for assign flow
    adminFastify.post('/events/:eventId/validate-players', async (request, reply) => {
      const { eventId } = request.params as { eventId: string };
      const { playerCodes } = request.body as { playerCodes: string[] };
      try {
        const players = await validatePlayers(Number(eventId), playerCodes);
        reply.send({ players });
      } catch (err) {
        if (err instanceof AppError) return reply.status(err.statusCode).send({ error: err.message });
        throw err;
      }
    });

    adminFastify.get('/events/:eventId/available-challenges', async (request, reply) => {
      const { eventId } = request.params as { eventId: string };
      const { playerIds, type } = request.query as { playerIds: string; type: string };
      const ids = playerIds.split(',').map(Number).filter(Boolean);
      const challenges = await getAvailableChallenges(Number(eventId), ids, type as ChallengeType);
      reply.send(challenges);
    });

    // Challenge instances
    adminFastify.post('/events/:eventId/instances', async (request, reply) => {
      const { eventId } = request.params as { eventId: string };
      const { challengeId, playerIds } = request.body as FromSchema<typeof instanceCreateSchema>;
      try {
        const instance = await createInstance(challengeId, Number(eventId), playerIds as number[]);
        reply.status(201).send(instance);
      } catch (err) {
        if (err instanceof AppError) return reply.status(err.statusCode).send({ error: err.message });
        throw err;
      }
    });

    adminFastify.get('/instances/:instanceId', async (request, reply) => {
      const { instanceId } = request.params as { instanceId: string };
      const instance = await getInstance(Number(instanceId));
      if (!instance) return reply.status(404).send({ error: 'Instance not found' });
      reply.send(instance);
    });

    adminFastify.patch('/instances/:instanceId/resolve', async (request, reply) => {
      const { instanceId } = request.params as { instanceId: string };
      const { results } = request.body as FromSchema<typeof instanceResolveSchema>;
      try {
        await resolveInstance(
          Number(instanceId),
          results as Array<{ participantId: number; status: 'COMPLETED' | 'FAILED' }>,
        );
        reply.status(204).send();
      } catch (err) {
        if (err instanceof AppError) return reply.status(err.statusCode).send({ error: err.message });
        throw err;
      }
    });

    // Attributes
    adminFastify.get('/attributes', async (_request, reply) => {
      const attributes = await listAttributes();
      reply.send(attributes);
    });

    // Challenges
    adminFastify.get('/challenges', async (_request, reply) => {
      const challenges = await listChallenges();
      reply.send(challenges);
    });

    adminFastify.post('/challenges', async (request, reply) => {
      const body = request.body as FromSchema<typeof challengeCreateSchema>;
      const challenge = await createChallenge({
        ...body,
        type: body.type as ChallengeType,
      });
      reply.status(201).send(challenge);
    });

    // Players
    adminFastify.get('/players/:id', async (request, reply) => {
      const { id } = request.params as { id: string };
      const result = await getPlayerById(Number(id));
      if (!result) return reply.status(404).send({ error: 'Player not found' });
      reply.send(result);
    });

    adminFastify.get('/players/by-code/:code', async (request, reply) => {
      const { code } = request.params as { code: string };
      const result = await getPlayerByCode(code);
      if (!result) return reply.status(404).send({ error: 'Player not found' });
      reply.send(result);
    });
  });
}
