import { z } from 'zod'

export const MapSchema = z.object({
	id: z.string(),
	name: z.string()
})

export type Map = z.infer<typeof MapSchema>
