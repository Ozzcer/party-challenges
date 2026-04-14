type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function api<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  if (!response.ok) {
    const { error } = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error);
  }

  if (response.status === 204) return null as T;
  return response.json();
}

export const apiGet = <T>(path: string) => api<T>('GET', path);
export const apiPost = <T>(path: string, body: unknown) => api<T>('POST', path, body);
export const apiPut = <T>(path: string, body: unknown) => api<T>('PUT', path, body);
export const apiPatch = <T>(path: string, body: unknown) => api<T>('PATCH', path, body);
export const apiDelete = <T>(path: string) => api<T>('DELETE', path);
