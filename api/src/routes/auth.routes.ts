import { FastifyInstance } from 'fastify';
import { adminLoginHandler, logoutHandler, playerLoginHandler } from '../controllers/auth.controller';

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/admin/login', adminLoginHandler);
  fastify.post('/public/login', playerLoginHandler);
  fastify.post('/logout', logoutHandler);
}