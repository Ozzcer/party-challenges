import { FastifyInstance } from 'fastify';
import { adminAuthGuard } from '../hooks/admin-auth.guard';

export async function adminRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.register(async (adminFastify) => {
    adminFastify.addHook('preHandler', adminAuthGuard);
  });
}
