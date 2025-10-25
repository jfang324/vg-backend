import { z } from 'zod'

export const AbilityCastsSchema = z.object({
	grenade: z
		.number()
		.nullable()
		.transform((value) => value ?? 0),
	ability1: z
		.number()
		.nullable()
		.transform((value) => value ?? 0),
	ability2: z
		.number()
		.nullable()
		.transform((value) => value ?? 0),
	ultimate: z
		.number()
		.nullable()
		.transform((value) => value ?? 0)
})

export type AbilityCasts = z.infer<typeof AbilityCastsSchema>
