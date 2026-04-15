import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import Fastify from 'fastify';
import { errorHandler } from './lib/error-handler.lib';
import { routes } from './routes/index.routes';

const fastify = Fastify({
  logger: true,
});

await fastify.register(fastifyCookie);
await fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
  cookie: {
    cookieName: 'token',
    signed: false,
  },
});

fastify.setErrorHandler(errorHandler);
await fastify.register(routes);

try {
  fastify.listen({ port: Number(process.env.PORT) ?? 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
