import { FastifyInstance } from 'fastify';

export async function routes(fastify: FastifyInstance) {
  fastify.get('/', async function handler (request, reply) {
    return { hello: 'world' }
  })
}
