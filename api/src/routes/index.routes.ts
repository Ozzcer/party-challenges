import { FastifyInstance } from 'fastify';
import { adminRoutes } from './admin.routes';
import { authRoutes } from './auth.routes';
import { publicRoutes } from './public.routes';

export async function routes(fastify: FastifyInstance): Promise<void> {
  fastify.register(authRoutes);
  fastify.register(adminRoutes, { prefix: '/admin' });
  fastify.register(publicRoutes, { prefix: '/public' });
}
