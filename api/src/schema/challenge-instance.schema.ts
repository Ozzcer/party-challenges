export const resolveChallengeBodySchema = {
  oneOf: [
    {
      type: 'object',
      properties: {
        status: { type: 'string', const: 'COMPLETED' },
        winningPlayer: { type: 'number' },
      },
      required: ['status'],
    },
    {
      type: 'object',
      properties: {
        status: { type: 'string', const: 'FAILED' },
      },
      required: ['status'],
    },
  ],
} as const;

export const instanceIdParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
  },
  required: ['id'],
} as const;
