import { z } from 'zod'

export const CustomizationSchema = z.object({
	card: z.string().nullable(),
	title: z.string().nullable(),
	preferredLevelBorder: z.string().nullable()
})

export type Customization = z.infer<typeof CustomizationSchema>
