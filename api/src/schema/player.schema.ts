export const setNameBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
  required: ['name'],
} as const;

export const playerIdParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
  },
  required: ['id'],
} as const;

export const playerCodeParamsSchema = {
  type: 'object',
  properties: {
    code: { type: 'string' },
  },
  required: ['code'],
} as const;
