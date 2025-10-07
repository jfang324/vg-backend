import { VALID_REGIONS } from '@common/constants/regions'
import { z } from 'zod'
import { MapSchema } from './schemas/map.schema'
import { MetadataSchema } from './schemas/metadata.schema'
import { PlayerSchema } from './schemas/player.schema'
import { StatsSchema } from './schemas/stats.schema'
import { TeamSchema } from './schemas/team.schema'

export const V4MatchSchema = z
	.object({
		metadata: MetadataSchema,
		players: z.array(PlayerSchema),
		teams: z.array(TeamSchema)
	})
	.strip()

export type ValidatedV4Match = z.infer<typeof V4MatchSchema>

const StoredPlayerSchema = StatsSchema.omit({
	damage: true,
	headshots: true,
	bodyshots: true,
	legshots: true
}).extend({
	puuid: z.string(),
	team: z.string(),
	character: z.object({
		id: z.string(),
		name: z.string()
	}),
	damage: z.object({
		made: z.number(),
		received: z.number()
	}),
	shots: z.object({
		head: z.number(),
		body: z.number(),
		leg: z.number()
	}),
	tier: z.number()
})

export const V1StoredMatchSchema = z.object({
	meta: z.object({
		id: z.string(),
		map: MapSchema,
		mode: z.string(),
		startedAt: z.string(),
		region: z.enum(VALID_REGIONS)
	}),
	stats: StoredPlayerSchema,
	teams: z.object({
		red: z.number(),
		blue: z.number()
	})
})

export type ValidatedV1StoredMatch = z.infer<typeof V1StoredMatchSchema>
