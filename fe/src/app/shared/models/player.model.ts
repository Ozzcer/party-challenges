import { Attribute } from './attribute.model';

export interface Player {
  id: number;
  playerCode: string;
  name: string;
  completedChallenges: number;
  attributeScores: {
    attribute: Attribute;
    score: number;
  }
  activeChallengeInstanceId?: number;
}
