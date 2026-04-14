import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('/api/admin/overview');
  if (!res.ok) return {};
  redirect(302, '/admin');
};
