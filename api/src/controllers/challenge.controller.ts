import type { FastifyReply, FastifyRequest } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { AppError } from '../lib/error-handler.lib';
import {
  createChallengeBodySchema,
  uncompletedChallengesBodySchema,
} from '../schema/challenge.schema';
import {
  createChallenge,
  getUncompletedChallengesForPlayers,
  listChallenges,
} from '../services/challenge.service';
import { getCurrentGameEvent } from '../services/game-event.service';
import { getPlayersIncludeActiveChallenge } from '../services/player.service';

export async function getChallenges(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const challenges = await listChallenges();
  reply.send(challenges);
}

export async function getUncompletedChallengesHandler(
  request: FastifyRequest<{
    Body: FromSchema<typeof uncompletedChallengesBodySchema>;
  }>,
  reply: FastifyReply,
): Promise<void> {
  const currentEvent = await getCurrentGameEvent();
  if (!currentEvent) {
    throw new AppError('No current event', 400);
  }
  const players = await getPlayersIncludeActiveChallenge(
    request.body.playerIds,
    currentEvent.id,
  );
  for (const player of players) {
    if (player.challengeParticipation.length > 0) {
      throw new AppError(
        `Player ${player.playerCode} already in challenge`,
        400,
      );
    }
  }

  const challenges = await getUncompletedChallengesForPlayers(
    request.body.playerIds,
  );
  reply.send(challenges);
}

export async function postChallenge(
  request: FastifyRequest<{
    Body: FromSchema<typeof createChallengeBodySchema>;
  }>,
  reply: FastifyReply,
): Promise<void> {
  const challenge = await createChallenge(request.body);
  reply.status(201).send(challenge);
}
