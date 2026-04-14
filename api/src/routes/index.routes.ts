import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes';
import { adminRoutes } from './admin.routes';
import { playerRoutes } from './player.routes';

export async function routes(fastify: FastifyInstance) {
  fastify.register(authRoutes);
  fastify.register(adminRoutes, { prefix: '/admin' });
  fastify.register(playerRoutes, { prefix: '/public' });
}
