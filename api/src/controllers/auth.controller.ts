import { FastifyReply, FastifyRequest } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { adminLoginSchema } from '../schema/admin-login.schema';
import { playerLoginSchema } from '../schema/player-login.schema';
import { adminLogin, playerLogin } from '../services/auth.service';

export async function adminLoginHandler(
  request: FastifyRequest<{
    Body: FromSchema<typeof adminLoginSchema>
  }>,
  reply: FastifyReply
): Promise<void> {
  const { username, password } = request.body;

  const admin = await adminLogin(username, password);
  if (!admin) {
    return reply.status(401).send({ error: 'Invalid credentials' });
  }

  const token = request.server.jwt.sign({ id: admin.id, role: 'admin' }, { expiresIn: '8h' });
  reply.setCookie('token', token, { httpOnly: true, path: '/', sameSite: 'strict' });
  reply.status(204).send();
}

export async function logoutHandler(
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  reply.clearCookie('token', { path: '/' });
  reply.status(204).send();
}

export async function playerLoginHandler(
  request: FastifyRequest<{
    Body: FromSchema<typeof playerLoginSchema>
  }>,
  reply: FastifyReply
): Promise<void> {
  const { playerCode } = request.body;

  const player = await playerLogin(playerCode);
  if (!player) {
    return reply.status(401).send({ error: 'Invalid player code' });
  }

  const token = request.server.jwt.sign({ id: player.id, role: 'player' });
  reply.setCookie('token', token, { httpOnly: true, path: '/', sameSite: 'strict' });
  reply.status(200).send({ nameRequired: player.name === null });
}