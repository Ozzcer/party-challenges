export const challengeCreateSchema = {
  type: 'object',
  required: ['description', 'score', 'type', 'attributeId'],
  properties: {
    description: { type: 'string', minLength: 1 },
    score: { type: 'integer', minimum: 1 },
    type: { type: 'string', enum: ['SOLO', 'ADVERSARIAL'] },
    attributeId: { type: 'integer' },
    custom: { type: 'boolean' },
  },
  additionalProperties: false,
} as const;
