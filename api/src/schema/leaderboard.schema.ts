export const leaderboardTitleIdSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
  },
  required: ['id'],
} as const;