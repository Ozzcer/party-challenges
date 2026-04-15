import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export type InstanceDetail = {
  id: number;
  challenge: {
    id: number;
    description: string;
    score: number;
    type: 'SOLO' | 'ADVERSARIAL';
    attribute: { id: number; name: string };
  };
  eventId: number;
  participants: Array<{
    id: number;
    playerId: number;
    status: string;
    player: { id: number; name: string | null; playerCode: string };
  }>;
};

export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
  // The player-by-code endpoint returns the full instance; we need to re-fetch it here
  // by fetching the event and finding the instance — but we don't know the event.
  // Instead, we'll call a dedicated instance endpoint. For now, re-use the player-by-code
  // result passed via URL state, or fetch events to find this instance.
  // Simplest: fetch the instance directly (we'll add a GET /admin/instances/:id endpoint).
  const response = await fetch(`/api/admin/instances/${params.instanceId}`);

  if (response.status === 401 || response.status === 403) redirect(302, '/admin/login');
  if (response.status === 404) redirect(302, '/admin');

  const instance = (await response.json()) as InstanceDetail;
  return { instance };
};
