import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { adminGet, ApiError } from '$lib/api';

export const ssr = false;

export const load: LayoutLoad = async ({ fetch }) => {
  try {
    const overview = await adminGet('/overview', fetch);
    return { overview };
  } catch (err) {
    if (err instanceof ApiError && (err.statusCode === 401 || err.statusCode === 403)) {
      redirect(302, '/admin/login');
    }
    throw err;
  }
};
