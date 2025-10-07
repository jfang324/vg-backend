import { z } from 'zod'

export const AgentSchema = z.object({
	id: z.string(),
	name: z.string()
})

export type Agent = z.infer<typeof AgentSchema>
