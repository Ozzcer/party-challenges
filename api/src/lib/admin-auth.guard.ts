import { FastifyReply, FastifyRequest } from 'fastify';

export async function adminAuthGuard(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  const payload = request.user as { role?: string };
  if (payload.role !== 'admin') {
    return reply.status(403).send({ error: 'Forbidden' });
  }
}
