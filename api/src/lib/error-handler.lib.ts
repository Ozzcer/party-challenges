import { ApiError } from '@party/shared';
import { FastifyReply, FastifyRequest } from 'fastify';

export class AppError extends Error {
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

export function errorHandler(
  error: unknown,
  _request: FastifyRequest,
  reply: FastifyReply,
): void {
  // TODO log
  // TODO minimise leaked info

  if (error instanceof AppError) {
    sendResponse(reply, {
      message: error.message,
      internalMessage: error.internalMessage,
      stack: error.stack,
      statusCode: error.statusCode,
      originalError: error,
      name: error.name,
    });
  } else if (error instanceof Error) {
    sendResponse(reply, {
      message: error.message,
      internalMessage: 'Unrecognised error',
      stack: error.stack,
      statusCode: 500,
      name: error.name,
      originalError: error,
    });
  } else {
    sendResponse(reply, {
      name: 'Error',
      message: 'Oops something went wrong, please try again later',
      internalMessage: 'Unknown error object',
      originalError: error,
      statusCode: 500,
    });
  }
}

function sendResponse(reply: FastifyReply, apiError: ApiError): void {
  reply.status(apiError.statusCode).send(apiError);
}
