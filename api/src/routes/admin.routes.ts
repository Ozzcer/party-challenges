import { FastifyInstance } from 'fastify';
import { adminAuthGuard } from '../lib/admin-auth.guard';
import { getOverview } from '../services/admin.service';

export async function adminRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.register(async (adminFastify) => {
    adminFastify.addHook('preHandler', adminAuthGuard);

    adminFastify.get('/overview', async (_request, reply) => {
      const overview = await getOverview();
      reply.send(overview);
    });
  });
}
