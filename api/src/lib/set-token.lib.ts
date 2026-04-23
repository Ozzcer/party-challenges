import { User } from '@party/shared';
import { FastifyReply, FastifyRequest } from 'fastify';

export function setToken(
  request: FastifyRequest,
  reply: FastifyReply,
  tokenDetails: User,
) {
  const token = request.server.jwt.sign(tokenDetails, { expiresIn: '8h' });
  reply.setCookie('token', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
  });
}
