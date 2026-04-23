import type { FastifyReply, FastifyRequest } from 'fastify';
import { listAttributes } from '../services/attribute.service';

export async function getAttributesHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const attributes = await listAttributes();
  reply.send(attributes);
}
