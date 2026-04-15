export const instanceCreateSchema = {
  type: 'object',
  required: ['challengeId', 'playerIds'],
  properties: {
    challengeId: { type: 'integer' },
    playerIds: { type: 'array', items: { type: 'integer' }, minItems: 1 },
  },
  additionalProperties: false,
} as const;
