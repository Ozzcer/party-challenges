import type {
  Admin,
  Attribute,
  Challenge,
  ChallengeInstance,
  ChallengeParticipant,
  GameEvent,
  GameEventPlayer,
  Player,
  PlayerAttributeScore,
  Title,
  TitleRequirement,
} from './generated';

// Sensitive fields stripped
export type ProtectedPlayer = Omit<Player, 'playerCode'>;
export type ProtectedAdmin = Omit<Admin, 'password'>;

// Relations with Player swapped to ProtectedPlayer
export type ProtectedGameEventPlayer = Omit<GameEventPlayer, 'player'> & {
  player?: ProtectedPlayer;
};

export type ProtectedPlayerAttributeScore = Omit<PlayerAttributeScore, 'player'> & {
  player?: ProtectedPlayer;
};

export type ProtectedChallengeParticipant = Omit<ChallengeParticipant, 'player'> & {
  player?: ProtectedPlayer;
};

// Cascaded protected relations
export type ProtectedChallengeInstance = Omit<ChallengeInstance, 'participants'> & {
  participants?: ProtectedChallengeParticipant[];
};

export type ProtectedGameEvent = Omit<GameEvent, 'players' | 'playerAttributeScores'> & {
  players?: ProtectedGameEventPlayer[];
  playerAttributeScores?: ProtectedPlayerAttributeScore[];
};

// No sensitive fields — aliases for consistency
export type ProtectedAttribute = Attribute;
export type ProtectedChallenge = Challenge;
export type ProtectedTitle = Title;
export type ProtectedTitleRequirement = TitleRequirement;
