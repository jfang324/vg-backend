import { Region } from '@common/constants/regions'

export type Player = {
	id: string
	name: string
	tag: string
	region: Region
	level: number
	customization: {
		card: string | null
		title: string | null
		preferred_level_border: string | null
	}
	rank: {
		id: number
		name: string
	}
}
