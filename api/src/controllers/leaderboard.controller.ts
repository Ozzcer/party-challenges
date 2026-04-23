import type { FastifyReply, FastifyRequest } from 'fastify';
import { getLeaderboards } from '../services/leaderboard.service';

export async function getLeaderboardsHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const leaderboards = await getLeaderboards();
  reply.send(leaderboards);
}
