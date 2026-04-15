export const eventUpdateSchema = {
  type: 'object',
  properties: {
    name:        { type: 'string' },
    description: { type: 'string' },
    current:     { type: 'boolean' },
  },
  additionalProperties: false,
} as const;
