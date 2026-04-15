import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
  const res = await fetch(`/api/admin/events/${params.id}`);
  if (res.status === 401 || res.status === 403) redirect(302, '/admin/login');
  if (res.status === 404) redirect(302, '/admin/events');
  return { eventId: params.id };
};
