import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async ({ fetch }) => {
  const response = await fetch('/api/admin/overview');

  if (response.status === 401 || response.status === 403) redirect(302, '/admin/login');

  const overview = await response.json();
  return { overview };
};
