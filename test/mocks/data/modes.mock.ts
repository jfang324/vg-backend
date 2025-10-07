import { Mode } from '@common/types/mode.type'
import { Mode as DB_MODE } from '@modules/database/types/mode.db.type'

export const mockModes: Mode[] = [
	{
		id: '0',
		name: 'Mode 0',
		modeType: 'Competitive'
	},
	{
		id: '1',
		name: 'Mode 1',
		modeType: 'Competitive'
	},
	{
		id: '2',
		name: 'Mode 2',
		modeType: 'Competitive'
	}
]

export const mockDbModes: DB_MODE[] = [
	{
		id: '0',
		name: 'Mode 0',
		mode_type: 'Competitive'
	},
	{
		id: '1',
		name: 'Mode 1',
		mode_type: 'Competitive'
	},
	{
		id: '2',
		name: 'Mode 2',
		mode_type: 'Competitive'
	}
]
