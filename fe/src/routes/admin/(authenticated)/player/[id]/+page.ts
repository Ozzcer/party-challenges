import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export type PlayerDetail = {
  player: { id: number; name: string | null; playerCode: string };
  activeEventId: number | null;
  instance: {
    id: number;
    challenge: {
      id: number;
      description: string;
      score: number;
      type: 'SOLO' | 'ADVERSARIAL';
      attribute: { id: number; name: string };
    };
    participants: Array<{
      id: number;
      playerId: number;
      status: string;
      player: { id: number; name: string | null; playerCode: string };
    }>;
  } | null;
};

export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
  const response = await fetch(`/api/admin/players/${params.id}`);

  if (response.status === 401 || response.status === 403) redirect(302, '/admin/login');
  if (response.status === 404) redirect(302, '/admin');

  const data = (await response.json()) as PlayerDetail;
  return data;
};
