import { FastifyInstance } from 'fastify';
import { adminRoutes } from './admin.routes';
import { authRoutes } from './auth.routes';
import { playerRoutes } from './player.routes';
import { publicRoutes } from './public.routes';

export async function routes(fastify: FastifyInstance): Promise<void> {
  fastify.register(authRoutes);
  fastify.register(adminRoutes, { prefix: '/admin' });
  fastify.register(playerRoutes, { prefix: '/player' });
  fastify.register(publicRoutes, { prefix: '/public' });
}
