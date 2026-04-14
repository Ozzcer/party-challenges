import Fastify from 'fastify';
import { routes } from './routes/index.routes';

const fastify = Fastify({
  logger: true,
});

await fastify.register(routes);

try {
  fastify.listen({ port: Number(process.env.PORT) ?? 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
