import { GameEvent } from './generated';

export type CurrentGameEvent = GameEvent & {
  current: true;
  totalChallengeInstances: number;
  totalPlayers: number;
}