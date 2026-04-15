import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch('/api/public/me');

  if (response.status === 401 || response.status === 403) {
    redirect(302, '/login');
  }

  const player = await response.json() as { name: string | null };
  if (player?.name !== null) redirect(302, '/');
};
