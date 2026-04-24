import {
  Challenge,
  ChallengeInstance,
  ChallengeParticipant,
  GameEvent,
  Player,
  PlayerAttributeScore,
} from './generated';
import {
  ProtectedChallenge,
  ProtectedChallengeInstance,
  ProtectedChallengeParticipant,
  ProtectedPlayer,
  ProtectedPlayerAttributeScore,
  ProtectedTitle,
  ProtectedTitleRequirement,
} from './protected.model';
import { WithRequired } from './util.types';

export interface ProtectedTitleDetails extends Omit<
  ProtectedTitle,
  'requirements'
> {
  requirements: WithRequired<ProtectedTitleRequirement, 'attribute'>[];
}
export interface Leaderboard {
  players: ProtectedPlayerDetails[];
  title: ProtectedTitleDetails;
  currentPlayerPosition?: number;
  currentPlayer: ProtectedPlayerDetails | null;
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
export type ProtectedChallengeDetails = WithRequired<
  ProtectedChallenge,
  'attribute'
>;

export interface ProtectedChallengeInstanceDetails extends Omit<
  ProtectedChallengeInstance,
  'participants' | 'challenges'
> {
  participants: ProtectedChallengeParticipantDetails[];
  challenge: ProtectedChallengeDetails;
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

export interface ProtectedPlayerDetails extends Omit<
  ProtectedPlayer,
  'playerAttributeScores'
> {
  playerAttributeScores: WithRequired<
    ProtectedPlayerAttributeScore,
    'attribute'
  >[];
}