import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async ({ fetch }) => {
  const response = await fetch('/api/public/me');

  if (response.status === 401 || response.status === 403) redirect(302, '/login');

  const player = await response.json() as { name: string };
  if (player.name == null) redirect(302, '/set-name');
  return { player };
};
