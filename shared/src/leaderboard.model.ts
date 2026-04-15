import type { Attribute, Player } from './generated';

export interface Leaderboard {
  players: Player[];
  attribute: Attribute;
  currentPlayerPosition?: number;
}
