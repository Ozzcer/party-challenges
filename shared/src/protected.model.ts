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

export type ProtectedPlayer = Omit<Player, 'playerCode'>;
export type ProtectedAdmin = Omit<Admin, 'password'>;

export type ProtectedGameEventPlayer = Omit<GameEventPlayer, 'player'> & {
  player?: ProtectedPlayer;
};

export type ProtectedPlayerAttributeScore = Omit<PlayerAttributeScore, 'player'> & {
  player?: ProtectedPlayer;
};

export type ProtectedChallengeParticipant = Omit<ChallengeParticipant, 'player'> & {
  player?: ProtectedPlayer;
};

export type ProtectedChallengeInstance = Omit<ChallengeInstance, 'participants'> & {
  participants?: ProtectedChallengeParticipant[];
};

export type ProtectedGameEvent = Omit<GameEvent, 'players' | 'playerAttributeScores'> & {
  players?: ProtectedGameEventPlayer[];
  playerAttributeScores?: ProtectedPlayerAttributeScore[];
};

export type ProtectedAttribute = Attribute;
export type ProtectedChallenge = Challenge;
export type ProtectedTitle = Title;
export type ProtectedTitleRequirement = TitleRequirement;
