import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export type EventDetail = {
  id: number;
  name: string;
  description: string;
  current: boolean;
  createdAt: string;
  players: Array<{
    id: number;
    player: { id: number; name: string | null; playerCode: string };
  }>;
  challengeInstances: Array<{
    id: number;
    challenge: { id: number; description: string; type: string };
    participants: Array<{ id: number; playerId: number; status: string }>;
  }>;
};

export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
  const response = await fetch(`/api/admin/events/${params.id}`);

  if (response.status === 401 || response.status === 403) redirect(302, '/admin/login');
  if (response.status === 404) redirect(302, '/admin/events');

  const event = await response.json() as EventDetail;
  return { event };
};
