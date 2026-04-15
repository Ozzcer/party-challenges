import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('/api/admin/attributes');
  if (res.status === 401 || res.status === 403) redirect(302, '/admin/login');
  const attributes = await res.json() as Array<{ id: number; name: string }>;
  return { attributes };
};
