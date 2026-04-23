import {
  Challenge,
  ChallengeInstance,
  ChallengeParticipant,
  GameEvent,
  Player,
  PlayerAttributeScore,
  Title,
} from './generated';
import {
  ProtectedChallenge,
  ProtectedChallengeInstance,
  ProtectedChallengeParticipant,
  ProtectedPlayer,
} from './protected.model';
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

export type ProtectedChallengeParticipantDetails = WithRequired<
  ProtectedChallengeParticipant,
  'player'
>;

export interface ProtectedChallengeInstanceDetails extends Omit<
  ProtectedChallengeInstance,
  'participants' | 'challenges'
> {
  participants: ProtectedChallengeParticipantDetails[];
  challenge: ProtectedChallenge;
} 

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

export interface ChallengeInstanceCreated {
  challengeInstance: ChallengeInstance;
  players: Player[];
}