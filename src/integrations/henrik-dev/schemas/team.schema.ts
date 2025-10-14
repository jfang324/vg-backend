import { z } from 'zod'

export const TeamSchema = z.object({
	teamId: z.string(),
	won: z.boolean(),
	rounds: z.object({
		won: z.number(),
		lost: z.number()
	})
})

export type Team = z.infer<typeof TeamSchema>
