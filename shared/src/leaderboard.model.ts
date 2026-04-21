import type { Title } from './generated';
import { ProtectedPlayer } from './protected.model';

export interface Leaderboard {
  players: ProtectedPlayer[];
  title: Title;
  currentPlayerPosition?: number;
}
