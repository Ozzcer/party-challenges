import type { FastifyReply, FastifyRequest } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import type { ResolveChallenge } from '@party/shared';
import { AppError } from '../lib/error-handler.lib';
import { instanceIdParamsSchema } from '../schema/challenge-instance.schema';
import {
  getActiveInstances,
  getInstanceById,
  resolveInstance,
} from '../services/challenge-instance.service';

export async function getActiveInstancesHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const instances = await getActiveInstances();
  reply.send(instances);
}

export async function getInstanceHandler(
  request: FastifyRequest<{ Params: FromSchema<typeof instanceIdParamsSchema> }>,
  reply: FastifyReply,
): Promise<void> {
  const instance = await getInstanceById(request.params.id);
  if (!instance) throw new AppError('Challenge instance not found', 404);
  reply.send(instance);
}

export async function resolveInstanceHandler(
  request: FastifyRequest<{
    Params: FromSchema<typeof instanceIdParamsSchema>;
    Body: ResolveChallenge;
  }>,
  reply: FastifyReply,
): Promise<void> {
  const instance = await resolveInstance(request.params.id, request.body);
  reply.send(instance);
}
