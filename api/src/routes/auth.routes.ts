import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { ApiError } from '../lib/error-handler.lib';
import { adminLoginSchema } from '../schema/admin-login.schema';
import { playerLoginSchema } from '../schema/player-login.schema';
import { adminLogin, playerLogin } from '../services/auth.service';

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/admin/login', async (
    request: FastifyRequest<{ Body: FromSchema<typeof adminLoginSchema> }>,
    reply: FastifyReply
  ) => {
    const { username, password } = request.body;

    const admin = await adminLogin(username, password);
    if (!admin) {
      throw new ApiError('Invalid credentials', 401);
    }

    const token = request.server.jwt.sign(
      { id: admin.id, name: admin.username, role: 'admin' },
      { expiresIn: '8h' },
    );
    reply.setCookie('token', token, { httpOnly: true, path: '/', sameSite: 'strict' });
    reply.status(204).send();
  });

  fastify.post('/public/login', async (
    request: FastifyRequest<{ Body: FromSchema<typeof playerLoginSchema> }>,
    reply: FastifyReply
  ): Promise<void> => {
    const { playerCode } = request.body;

    const player = await playerLogin(playerCode);
    if (!player) {
      throw new ApiError('Invalid player code', 401);
    }

    // TODO enroll in current event

    const token = request.server.jwt.sign({
      id: player.id,
      name: player.name,
      role: 'player',
    });
    reply.setCookie('token', token, { httpOnly: true, path: '/', sameSite: 'strict' });
    reply.status(200).send({ nameRequired: player.name === null });
  });

  fastify.get(
    '/auth/logout',
    async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      reply.clearCookie('token', { path: '/' });
      reply.status(204).send();
    },
  );

  fastify.get(
    '/auth/me',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        await request.jwtVerify();
      } catch (error) {
        throw new ApiError('You are not logged in', 401);
      }
      reply.send(request.user);
    },
  );
}
