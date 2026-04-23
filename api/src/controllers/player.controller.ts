import type { FastifyReply, FastifyRequest } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { AppError } from '../lib/error-handler.lib';
import { setToken } from '../lib/set-token.lib';
import {
  playerByCodeBodySchema,
  playerCodeParamsSchema,
  playerIdParamsSchema,
  setNameBodySchema,
} from '../schema/player.schema';
import {
  getPlayerByCode,
  getPlayerById,
  getPlayerChallenges,
  getPlayerCurrentChallenge,
  getPlayerDetails,
  getUnusedPlayerCodes,
  isPlayerEnrolled,
  listPlayersInCurrentEvent,
  setPlayerName,
} from '../services/player.service';
import { getEarnedTitles } from '../services/title.service';

export async function listPlayersHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const players = await listPlayersInCurrentEvent();
  reply.send(players);
}

export async function getPlayerByIdHandler(
  request: FastifyRequest<{ Params: FromSchema<typeof playerIdParamsSchema> }>,
  reply: FastifyReply,
): Promise<void> {
  const player = await getPlayerById(request.params.id);
  if (!player) throw new AppError('Player not found', 404);
  reply.send(player);
}

export async function getPlayerByCodeHandler(
  request: FastifyRequest<{
    Params: FromSchema<typeof playerCodeParamsSchema>;
    Body: FromSchema<typeof playerByCodeBodySchema>;
  }>,
  reply: FastifyReply,
): Promise<void> {
  const playerId = await getPlayerByCode(request.params.code, request.body.enrolledInCurrentEvent ?? false);
  if (playerId === null) throw new AppError('Player not found', 404);
  reply.send(playerId);
}

export async function getUnusedPlayerCodesHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const codes = await getUnusedPlayerCodes();
  reply.send(codes);
}

export async function setNameHandler(
  request: FastifyRequest<{ Body: FromSchema<typeof setNameBodySchema> }>,
  reply: FastifyReply,
): Promise<void> {
  const user = request.user;
  if (user.role === 'admin') throw new AppError('Admin cannot set name', 400);
  await setPlayerName(request.user.id, request.body.name);
  setToken(request, reply, {
    ...user,
    name: request.body.name,
  });
  reply.status(204).send();
}

export async function isEnrolledHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const enrolled = await isPlayerEnrolled(request.user.id);
  reply.send(enrolled);
}

export async function getPlayerDetailsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const player = await getPlayerDetails(request.user.id);
  if (!player) throw new AppError('Player not found', 404);
  reply.send(player);
}

export async function getPlayerChallengesHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const challenges = await getPlayerChallenges(request.user.id);
  reply.send(challenges);
}

export async function getPlayerCurrentChallengeHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const challenge = await getPlayerCurrentChallenge(request.user.id);
  if (!challenge) throw new AppError('No active challenge', 404);
  reply.send(challenge);
}

export async function getPlayerCurrentChallengeByIdHandler(
  request: FastifyRequest<{ Params: FromSchema<typeof playerIdParamsSchema> }>,
  reply: FastifyReply,
): Promise<void> {
  const challenge = await getPlayerCurrentChallenge(request.params.id);
  if (!challenge) throw new AppError('No active challenge', 404);
  reply.send(challenge);
}

export async function getEarnedTitlesByIdHandler(
  request: FastifyRequest<{ Params: FromSchema<typeof playerIdParamsSchema> }>,
  reply: FastifyReply,
): Promise<void> {
  const titles = await getEarnedTitles(request.params.id);
  reply.send(titles);
}
