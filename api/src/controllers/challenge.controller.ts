import type { FastifyReply, FastifyRequest } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { createChallengeBodySchema } from '../schema/challenge.schema';
import { createChallenge, listChallenges } from '../services/challenge.service';

export async function getChallenges(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const challenges = await listChallenges();
  reply.send(challenges);
}

export async function postChallenge(
  request: FastifyRequest<{ Body: FromSchema<typeof createChallengeBodySchema> }>,
  reply: FastifyReply,
): Promise<void> {
  const challenge = await createChallenge(request.body);
  reply.status(201).send(challenge);
}
