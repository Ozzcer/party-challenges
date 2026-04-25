import type {
  ProtectedChallengeInstanceDetails,
  ResolveChallenge,
} from '@party/shared';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { AppError } from '../lib/error-handler.lib';
import { instanceIdParamsSchema } from '../schema/challenge-instance.schema';
import {
  assignChallengeBodySchema,
  challengeIdParamsSchema,
} from '../schema/challenge.schema';
import {
  assignChallenge,
  getActiveInstances,
  getInstanceById,
  setParticipantsStatus,
} from '../services/challenge-instance.service';
import { getChallengeById } from '../services/challenge.service';
import { getCurrentGameEvent } from '../services/game-event.service';
import {
  getPlayersIncludeActiveChallenge,
  incrementPlayerAttributeScore,
} from '../services/player.service';

export async function getActiveInstancesHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const instances = await getActiveInstances();
  reply.send(instances);
}

export async function getInstanceHandler(
  request: FastifyRequest<{
    Params: FromSchema<typeof instanceIdParamsSchema>;
  }>,
  reply: FastifyReply,
): Promise<void> {
  const instance = await getInstanceById(request.params.id);
  if (!instance) throw new AppError('Challenge instance not found', 404);
  reply.send(instance);
}

export async function assignChallengeHandler(
  request: FastifyRequest<{
    Params: FromSchema<typeof challengeIdParamsSchema>;
    Body: FromSchema<typeof assignChallengeBodySchema>;
  }>,
  reply: FastifyReply,
): Promise<void> {
  if (request.body.playerIds.length === 0) {
    throw new AppError('No players to assign', 400);
  }

  const event = await getCurrentGameEvent();
  if (!event) throw new AppError('No current game event', 400);

  const challenge = await getChallengeById(request.params.challengeId);
  if (!challenge) throw new AppError('Challenge not found', 400);

  if (challenge.type === 'ADVERSARIAL' && request.body.playerIds.length < 2) {
    throw new AppError(
      'Cannot start an adverserial challenge with one player',
      400,
    );
  }

  const players = await getPlayersIncludeActiveChallenge(
    request.body.playerIds,
    event.id,
  );

  for (const player of players) {
    if (player.challengeParticipation.length > 0) {
      throw new AppError(
        'One or more players are already in an active challenge',
        400,
      );
    }
  }

  const instances = await assignChallenge(challenge, players, event.id);
  reply.send(instances);
}

export async function resolveInstanceHandler(
  request: FastifyRequest<{
    Params: FromSchema<typeof instanceIdParamsSchema>;
    Body: ResolveChallenge;
  }>,
  reply: FastifyReply,
): Promise<void> {
  const instance = await getInstanceById(request.params.id);
  if (!instance) throw new AppError('Challenge instance not found', 404);

  if (request.body.status === 'COMPLETED') {
    await resolveInstanceAsCompleted(instance, request.body.winningPlayers);
  } else {
    await resolveInstanceAsFailed(instance);
  }

  reply.status(204).send();
}

async function resolveInstanceAsFailed(
  instance: ProtectedChallengeInstanceDetails,
): Promise<void> {
  const ids = instance.participants.map((participant) => {
    if (participant.status !== 'OPEN') {
      throw new AppError('Challenge already resolved', 400);
    }
    return participant.id;
  });

  await setParticipantsStatus(ids, 'FAILED');
}

async function resolveInstanceAsCompleted(
  instance: ProtectedChallengeInstanceDetails,
  winnerIds: number[],
): Promise<void> {
  const losingParticipantIds: number[] = [];
  const winnerParticipantIds: number[] = [];
  for (const participant of instance.participants) {
    if (participant.status !== 'OPEN') {
      throw new AppError('Challenge already resolved', 400);
    }
    if (winnerIds.includes(participant.playerId)) {
      winnerParticipantIds.push(participant.id);
    } else {
      losingParticipantIds.push(participant.id);
    }
  }

  if (winnerParticipantIds.length !== winnerIds.length) {
    throw new AppError('Selected winner is not in challenge', 400);
  }

  await setParticipantsStatus(losingParticipantIds, 'FAILED');
  await setParticipantsStatus(winnerParticipantIds, 'COMPLETED');
  await Promise.all(
    winnerIds.map((id) => {
      incrementPlayerAttributeScore(
        id,
        instance.eventId,
        instance.challenge.attributeId,
        instance.challenge.score,
      );
    }),
  );
}
