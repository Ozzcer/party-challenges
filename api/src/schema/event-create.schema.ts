export const eventCreateSchema = {
  type: 'object',
  required: ['name', 'description'],
  properties: {
    name:        { type: 'string' },
    description: { type: 'string' },
    current:     { type: 'boolean' },
  },
  additionalProperties: false,
} as const;
