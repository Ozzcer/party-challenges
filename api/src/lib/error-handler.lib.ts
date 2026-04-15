import { FastifyReply, FastifyRequest } from 'fastify';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public internalMessage?: string,
  ) {
    super(message);
    this.name = 'ApiError';
    this.internalMessage ??= message;
  }
}

export function errorHandler(error: unknown, request: FastifyRequest, reply: FastifyReply): void {
  // TODO log
  // TODO minimise leaked info

  if(error instanceof ApiError) {
    reply.status(error.statusCode).send({
      message: error.message,
      internalMessage: error.internalMessage,
      stack: error.stack,
      statusCode: error.statusCode,
      originalError: error,
      name: error.name,
    });
  } else if (error instanceof Error) {
    reply.status(500).send({
      message: error.message,
      internalMessage: 'Unrecognised error',
      stack: error.stack,
      statusCode: 500,
      name: error.name,
      originalError: error,
    });
  } else {
    reply.status(500).send({
      message: 'Oops something went wrong, please try again later',
      internalMessage: 'Unknown error object',
      originalError: error,
    });
  }
}