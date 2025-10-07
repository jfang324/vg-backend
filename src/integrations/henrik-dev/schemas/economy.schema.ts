import { z } from 'zod'

const EconomySubSchema = z.object({
	overall: z.number(),
	average: z.number()
})

export const EconomySchema = z.object({
	spent: EconomySubSchema,
	loadoutValue: EconomySubSchema
})

export type Economy = z.infer<typeof EconomySchema>
