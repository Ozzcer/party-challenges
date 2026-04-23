import {
  Challenge,
  ChallengeParticipant,
  GameEvent,
  Player,
  PlayerAttributeScore,
  Title,
} from './generated';
import { ProtectedChallengeInstance, ProtectedPlayer } from './protected.model';
import { WithRequired } from './util.types';

export interface Leaderboard {
  players: ProtectedPlayer[];
  title: Title;
  currentPlayerPosition?: number;
}

export type CurrentGameEvent = GameEvent & {
  current: true;
  totalChallengeInstances: number;
  totalPlayers: number;
};

export type ProtectedChallengeInstanceDetails = WithRequired<
  ProtectedChallengeInstance,
  'participants' | 'challenge'
>;

export interface ChallengeParticipantDetails extends Omit<
  ChallengeParticipant,
  'instance'
> {
  instance: ProtectedChallengeInstanceDetails;
}

export interface PlayerDetails extends Omit<
  Player,
  'challengeParticipation' | 'playerAttributeScores'
> {
  challengeParticipation: ChallengeParticipantDetails[];
  playerAttributeScores: WithRequired<PlayerAttributeScore, 'attribute'>[];
}

export type ChallengeDetails = WithRequired<Challenge, 'attribute'>;