import type { FastifyReply, FastifyRequest } from 'fastify';
import { getAllTitles, getEarnedTitles } from '../services/title.service';

export async function getPlayerTitlesHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const titles = await getEarnedTitles(request.user.id);
  reply.send(titles);
}

export async function getAllTitlesHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const titles = await getAllTitles();
  reply.send(titles);
}