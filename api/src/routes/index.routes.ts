import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes';

export async function routes(fastify: FastifyInstance) {
  fastify.register(authRoutes);
}
