import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export type EventSummary = {
  id: number;
  name: string;
  description: string;
  current: boolean;
  createdAt: string;
  _count: { players: number; challengeInstances: number };
};

export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch('/api/admin/events');

  if (response.status === 401 || response.status === 403) redirect(302, '/admin/login');

  const events = await response.json() as EventSummary[];
  return { events };
};
