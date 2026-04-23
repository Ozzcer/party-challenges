import type { FastifyReply, FastifyRequest } from 'fastify';
import { getEarnedTitles } from '../services/title.service';

export async function getPlayerTitlesHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const titles = await getEarnedTitles(request.user.id);
  reply.send(titles);
}
