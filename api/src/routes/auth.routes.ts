import { FastifyInstance } from 'fastify';
import { adminLoginHandler, playerLoginHandler } from '../controllers/auth.controller';

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/admin/login', adminLoginHandler);
  fastify.post('/login', playerLoginHandler);
}