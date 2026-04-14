import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes';
import { adminRoutes } from './admin.routes';

export async function routes(fastify: FastifyInstance) {
  fastify.register(authRoutes);
  fastify.register(adminRoutes, { prefix: '/admin' });
}
