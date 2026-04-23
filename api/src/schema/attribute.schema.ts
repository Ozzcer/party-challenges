export const attributeResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    description: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
  required: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
} as const;

export const attributeListResponseSchema = {
  type: 'array',
  items: attributeResponseSchema,
} as const;
