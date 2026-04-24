import type { FastifyReply, FastifyRequest } from 'fastify';
import { getLeaderboards } from '../services/leaderboard.service';

export async function getLeaderboardsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const playerId = request.user.role === 'player' ? request.user.id : undefined;
  const leaderboards = await getLeaderboards(playerId);
  reply.send(leaderboards);
}
