import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('/api/public/me');
  if (!res.ok) return {};
  const player: { name: string | null } = await res.json();
  redirect(302, player.name === null ? '/set-name' : '/');
};
