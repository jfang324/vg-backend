import { z } from 'zod'

export const AbilityCastsSchema = z.object({
	grenade: z.number(),
	ability1: z.number(),
	ability2: z.number(),
	ultimate: z.number()
})

export type AbilityCasts = z.infer<typeof AbilityCastsSchema>
