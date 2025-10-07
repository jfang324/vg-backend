import { z } from 'zod'

export const StatsSchema = z.object({
	score: z.number(),
	kills: z.number(),
	deaths: z.number(),
	assists: z.number(),
	damage: z.object({
		dealt: z.number(),
		received: z.number()
	}),
	headshots: z.number(),
	bodyshots: z.number(),
	legshots: z.number()
})

export type Stats = z.infer<typeof StatsSchema>
