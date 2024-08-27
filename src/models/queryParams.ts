import { z } from 'zod'

export const QueryParamsSchema = z.object({
  page: z.number().optional().default(0),
  limit: z.number().optional().default(20),
  query: z.string().optional().default(''),
  orderBy: z.string().optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc')
})
