import { ChallengeStatus, ChallengeType } from './generated';

export interface CreateChallenge {
  description: string;
  score: number;
  type: ChallengeType;
  attributeId: number;
}

export type ResolveChallenge = {
  status: Extract<ChallengeStatus, 'COMPLETED'>
  winningPlayer: number;
} | {
  status: Extract<ChallengeStatus, 'FAILED'>
}