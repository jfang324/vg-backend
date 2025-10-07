import { z } from 'zod'

export const RankSchema = z.object({
	id: z.number(),
	name: z.string()
})

export type Rank = z.infer<typeof RankSchema>
