import { z } from 'zod'

const FriendlyFireSchema = z.object({
	incoming: z.number(),
	outgoing: z.number()
})

export const BehaviourSchema = z.object({
	afkRounds: z.number(),
	friendlyFire: FriendlyFireSchema,
	roundsInSpawn: z.number()
})

export type Behaviour = z.infer<typeof BehaviourSchema>
