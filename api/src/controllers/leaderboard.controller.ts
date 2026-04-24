import type { FastifyReply, FastifyRequest } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { AppError } from '../lib/error-handler.lib';
import { leaderboardTitleIdSchema } from '../schema/leaderboard.schema';
import { getCurrentGameEvent } from '../services/game-event.service';
import {
  getMultiAttributeLeaderboard,
  getSingleAttributeLeaderboard,
} from '../services/leaderboard.service';
import { getPlayerDetails } from '../services/player.service';
import { getTitleById } from '../services/title.service';

export async function getLeaderboardHandler(
  request: FastifyRequest<{
    Params: FromSchema<typeof leaderboardTitleIdSchema>;
  }>,
  reply: FastifyReply,
): Promise<void> {
  const currentEvent = await getCurrentGameEvent();
  if (!currentEvent) throw new AppError('No event currently running', 400);
  const title = await getTitleById(request.params.id);
  if (!title) throw new AppError('No leaderboard found for this title', 404);


  const currentPlayer =
    request.user.role === 'player'
      ? await getPlayerDetails(request.user.id)
      : null;

  if (title.titleType === 'SINGLE_REQUIREMENT') {
    const leaderboard = await getSingleAttributeLeaderboard(
      currentEvent.id,
      title,
      title.requirements[0],
      currentPlayer,
    );
    reply.send(leaderboard);
  } else if (title.titleType === 'MULTI_REQUIREMENT_AVERAGE') {
    const leaderboard = await getMultiAttributeLeaderboard(
      currentEvent.id,
      title,
      title.requirements,
      currentPlayer,
    );
    reply.send(leaderboard);
  }
}
