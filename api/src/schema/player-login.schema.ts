export const playerLoginSchema = {
  type: 'object',
  properties: {
    playerCode: { type: 'string' },
  },
  required: ['playerCode'],
} as const;
