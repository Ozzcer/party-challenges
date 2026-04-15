export interface ApiError extends Error {
  message: string;
  statusCode: number;
  name: string;
  internalMessage?: string;
  stack?: string;
  originalError?: unknown;
}

export function isApiError(error: unknown): error is ApiError {
  if (error === null || error === undefined) return false;
  if (typeof error !== 'object') return false;
  return 'statusCode' in error && 'message' in error && 'name' in error;
}
