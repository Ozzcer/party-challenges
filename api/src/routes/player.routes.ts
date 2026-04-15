import { FastifyInstance } from 'fastify';
import { playerAuthGuard } from '../lib/player-auth.guard';
import { setPlayerName } from '../services/player.service';
import { prisma } from '../lib/prisma';

export async function playerRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.register(async (playerFastify) => {
    playerFastify.addHook('preHandler', playerAuthGuard);

    playerFastify.get('/me', async (request, reply) => {
      const { id } = request.user as { id: number };
      const player = await prisma.player.findUnique({ where: { id } });
      if (!player) return reply.status(404).send({ error: 'Player not found' });

      const currentEvent = await prisma.gameEvent.findFirst({ where: { current: true } });
      if (!currentEvent) return reply.status(401).send({ error: 'No active event' });

      const enrolled = await prisma.gameEventPlayer.findUnique({
        where: { eventId_playerId: { eventId: currentEvent.id, playerId: id } },
      });
      if (!enrolled) return reply.status(401).send({ error: 'Not registered in current event' });

      reply.send(player);
    });

    playerFastify.patch('/me/name', async (request, reply) => {
      const { id } = request.user as { id: number };

      const player = await prisma.player.findUnique({ where: { id } });
      if (!player) return reply.status(404).send({ error: 'Player not found' });
      if (player.name !== null) return reply.status(400).send({ error: 'Name already set' });

      const { name } = request.body as { name: string };
      await setPlayerName(id, name);
      reply.status(204).send();
    });
  });
}
