import { z } from 'zod'

export const MapSchema = z.object({
	id: z.string(),
	name: z.string()
})

export const QueueSchema = z.object({
	id: z.string(),
	name: z.string(),
	mode_type: z.string()
})

export const MetadataSchema = z.object({
	match_id: z.string(),
	started_at: z.string(),
	map: MapSchema,
	queue: QueueSchema,
	region: z.string()
})

export const AgentSchema = z.object({
	id: z.string(),
	name: z.string()
})

export const CustomizationSchema = z.object({
	card: z.string().optional().nullable(),
	title: z.string().optional().nullable(),
	preferred_level_border: z.string().nullable()
})

export const RankSchema = z.object({
	id: z.number(),
	name: z.string()
})

export const PlayerStatsSchema = z.object({
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

export const PlayerSchema = z.object({
	puuid: z.string(),
	name: z.string(),
	tag: z.string(),
	team_id: z.string(),
	agent: AgentSchema,
	account_level: z.number(),
	tier: RankSchema,
	customization: CustomizationSchema,
	stats: PlayerStatsSchema,
	ability_casts: z.unknown().optional(),
	behavior: z.unknown().optional(),
	economy: z.unknown().optional()
})

export const TeamSchema = z.object({
	team_id: z.string(),
	won: z.boolean()
})

export const V4MatchSchema = z.object({
	metadata: MetadataSchema,
	players: z.array(PlayerSchema),
	teams: z.array(TeamSchema)
})

export type ValidatedV4Match = z.infer<typeof V4MatchSchema>

export type Player = {
	id: string
	name: string
	tag: string
	region: string
	level: number
	customization: z.infer<typeof CustomizationSchema>
	rank: z.infer<typeof RankSchema>
}

export type Match = {
	id: string
	map: string
	mode: string
	date: string
	winning_team: string
}

export type Performance = {
	player_id: string
	match_id: string
	team: string
	agent: string
	score: number
	kills: number
	deaths: number
	assists: number
	damage_dealt: number
	damage_taken: number
	headshots: number
	bodyshots: number
	legshots: number
	ability_casts: unknown
	rank: z.infer<typeof RankSchema>
	behavior: unknown
	economy: unknown
}
