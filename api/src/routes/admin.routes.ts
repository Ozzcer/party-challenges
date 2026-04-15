import { FastifyInstance } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { adminAuthGuard } from '../lib/admin-auth.guard';
import { getOverview } from '../services/admin.service';
import { createEvent, getEvent, listEvents, updateEvent } from '../services/event.service';
import { eventCreateSchema } from '../schema/event-create.schema';
import { eventUpdateSchema } from '../schema/event-update.schema';

export async function adminRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.register(async (adminFastify) => {
    adminFastify.addHook('preHandler', adminAuthGuard);

    adminFastify.get('/overview', async (_request, reply) => {
      const overview = await getOverview();
      reply.send(overview);
    });

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
  });
}
