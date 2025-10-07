import { z } from 'zod'
import { AbilityCastsSchema } from './ability-casts.schema'
import { AgentSchema } from './agent.schema'
import { BehaviourSchema } from './behaviour.schema'
import { CustomizationSchema } from './customization.schema'
import { EconomySchema } from './economy.schema'
import { RankSchema } from './rank.schema'
import { StatsSchema } from './stats.schema'

export const PlayerSchema = z.object({
	puuid: z.string(),
	name: z.string(),
	tag: z.string(),
	teamId: z.string(),
	agent: AgentSchema,
	accountLevel: z.number(),
	tier: RankSchema,
	customization: CustomizationSchema,
	stats: StatsSchema,
	abilityCasts: AbilityCastsSchema,
	behavior: BehaviourSchema,
	economy: EconomySchema
})

export type Player = z.infer<typeof PlayerSchema>
