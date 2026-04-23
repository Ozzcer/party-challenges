import { GameEvent, Title } from './generated';
import { ProtectedChallengeInstance, ProtectedPlayer } from './protected.model';
import { WithRequired } from './util.types';

export type CurrentGameEvent = GameEvent & {
  current: true;
  totalChallengeInstances: number;
  totalPlayers: number;
}

export interface Leaderboard {
  players: ProtectedPlayer[];
  title: Title;
  currentPlayerPosition?: number;
}

export type ChallengeInstanceDetails = WithRequired<ProtectedChallengeInstance, 'participants' | 'challenge'>