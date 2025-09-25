import { Region, VALID_REGIONS } from '@common/constants/regions'
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

export const RecentMetadataSchema = z.object({
	match_id: z.string(),
	started_at: z.string(),
	map: MapSchema,
	queue: QueueSchema,
	region: z.enum(VALID_REGIONS)
})

export const AgentSchema = z.object({
	id: z.string(),
	name: z.string()
})

export const CustomizationSchema = z.object({
	card: z.string().default('').nullable(),
	title: z.string().default('').nullable(),
	preferred_level_border: z.string().default('').nullable()
})

export const RankSchema = z.object({
	id: z.number(),
	name: z.string()
})

export const RecentPlayerStatsSchema = z.object({
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

export const RecentPlayerSchema = z.object({
	puuid: z.string(),
	name: z.string(),
	tag: z.string(),
	team_id: z.string(),
	agent: AgentSchema,
	account_level: z.number(),
	tier: RankSchema,
	customization: CustomizationSchema,
	stats: RecentPlayerStatsSchema,
	ability_casts: z.unknown().optional(),
	behavior: z.unknown().optional(),
	economy: z.unknown().optional()
})

export const RecentTeamSchema = z.object({
	team_id: z.string(),
	won: z.boolean()
})

export const V4RecentMatchSchema = z.object({
	metadata: RecentMetadataSchema,
	players: z.array(RecentPlayerSchema),
	teams: z.array(RecentTeamSchema)
})

export type ValidatedV4Match = z.infer<typeof V4RecentMatchSchema>

export type Player = {
	id: string
	name: string
	tag: string
	region: Region
	level: number
	customization: z.infer<typeof CustomizationSchema>
	rank: z.infer<typeof RankSchema>
}

export type Match = {
	id: string
	map_id: string
	mode_id: string
	date: string
	winning_team: string
}

export type Performance = {
	player_id: string
	match_id: string
	team: string
	agent_id: string
	score: number
	kills: number
	deaths: number
	assists: number
	damage_dealt: number
	damage_taken: number
	headshots: number
	bodyshots: number
	legshots: number
	rank: z.infer<typeof RankSchema>
	ability_casts: unknown
	behavior: unknown
	economy: unknown
}

export const StoredMetadataSchema = z.object({
	id: z.string(),
	map: MapSchema,
	mode: z.string(),
	started_at: z.string(),
	region: z.enum(VALID_REGIONS)
})

export const StoredPlayerStatsSchema = z.object({
	puuid: z.string(),
	team: z.string(),
	character: z.object({
		id: z.string(),
		name: z.string()
	}),
	tier: z.number(),
	score: z.number(),
	kills: z.number(),
	deaths: z.number(),
	assists: z.number(),
	shots: z.object({
		head: z.number(),
		body: z.number(),
		leg: z.number()
	}),
	damage: z.object({
		made: z.number(),
		received: z.number()
	})
})

export const V1ValidatedStoredMatch = z.object({
	meta: StoredMetadataSchema,
	stats: StoredPlayerStatsSchema,
	teams: z.object({
		red: z.number(),
		blue: z.number()
	})
})

export type ValidatedV1StoredMatch = z.infer<typeof V1ValidatedStoredMatch>
