import { VALID_REGIONS } from '@common/constants/regions'
import { z } from 'zod'
import { MapSchema } from './map.schema'
import { ModeSchema } from './mode.schema'

export const MetadataSchema = z.object({
	matchId: z.string(),
	startedAt: z.string(),
	map: MapSchema,
	queue: ModeSchema,
	region: z.enum(VALID_REGIONS)
})
