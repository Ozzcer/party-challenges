export const uncompletedChallengesBodySchema = {
  type: 'object',
  properties: {
    playerIds: { type: 'array', items: { type: 'number' } },
  },
  required: ['playerIds'],
} as const;

export const createChallengeBodySchema = {
  type: 'object',
  properties: {
    description: { type: 'string' },
    score: { type: 'number' },
    type: { type: 'string', enum: ['SOLO', 'ADVERSARIAL'] },
    attributeId: { type: 'number' },
  },
  required: ['description', 'score', 'type', 'attributeId'],
} as const;
