import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { publicGet, ApiError } from '$lib/api';

export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
  try {
    const player = await publicGet<{ name: string | null }>('/me', fetch);
    if (player?.name !== null) redirect(302, '/');
  } catch (err) {
    if (err instanceof ApiError && (err.statusCode === 401 || err.statusCode === 403)) {
      redirect(302, '/login');
    }
    throw err;
  }
};
