import { z } from 'zod'

export const TeamSchema = z.object({
	teamId: z.string(),
	won: z.boolean()
})

export type Team = z.infer<typeof TeamSchema>
