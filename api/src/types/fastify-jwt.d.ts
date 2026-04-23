import type { User } from '@party/shared';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: User;
    user: User;
  }
}
