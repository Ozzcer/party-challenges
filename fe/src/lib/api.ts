import { goto } from '$app/navigation';
import { page } from '$app/state';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type ApiType = 'admin' | 'public'; 


export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError'
  }
}
async function api<T>(type: ApiType, method: HttpMethod, path: string, body?: unknown): Promise<T | ApiError | null> {
  const response = await fetch(`/api${path}`, {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {                   
      if (type === 'admin' && page.url.pathname !== '/admin/login') {
        goto('/admin/login');
      } else if (type === 'public' && page.url.pathname !== '/login') {
        goto('/login');
      }                                                                    
    }
    const data: Record<string, unknown> = await response.json().catch(() => (undefined));
    throw new ApiError(data?.error?.toString() ?? response.statusText, response.status, data);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const adminGet = <T>(path: string, fetchFn?: typeof fetch) => api<T>('admin', 'GET', `/admin${path}`, undefined);
export const adminPost = <T>(path: string, body: unknown, fetchFn?: typeof fetch) => api<T>('admin', 'POST', `/admin${path}`, body);
export const adminPut = <T>(path: string, body: unknown, fetchFn?: typeof fetch) => api<T>('admin', 'PUT', `/admin${path}`, body);
export const adminPatch = <T>(path: string, body: unknown, fetchFn?: typeof fetch) => api<T>('admin', 'PATCH', `/admin${path}`, body);
export const adminDelete = <T>(path: string, fetchFn?: typeof fetch) => api<T>('admin', 'DELETE', `/admin${path}`, undefined);

export const publicGet = <T>(path: string, fetchFn?: typeof fetch) => api<T>('public', 'GET', `/public${path}`, undefined);
export const publicPost = <T>(path: string, body: unknown, fetchFn?: typeof fetch) => api<T>('public', 'POST', `/public${path}`, body);
export const publicPut = <T>(path: string, body: unknown, fetchFn?: typeof fetch) => api<T>('public', 'PUT', `/public${path}`, body);
export const publicPatch = <T>(path: string, body: unknown, fetchFn?: typeof fetch) => api<T>('public', 'PATCH', `/public${path}`, body);
export const publicDelete = <T>(path: string, fetchFn?: typeof fetch) => api<T>('public', 'DELETE', `/public${path}`, undefined);