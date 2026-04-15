export const instanceResolveSchema = {
  type: 'object',
  required: ['results'],
  properties: {
    results: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['participantId', 'status'],
        properties: {
          participantId: { type: 'integer' },
          status: { type: 'string', enum: ['COMPLETED', 'FAILED'] },
        },
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
} as const;
