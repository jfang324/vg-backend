import { Match } from '@common/types/match.type'
import { Match as DB_Match } from '@modules/database/types/match.db.type'

export const mockMatches: Match[] = [
	{
		id: '0',
		mapId: '0',
		modeId: '0',
		date: new Date('2022-01-01T00:00:00.000Z'),
		winningTeam: 'Red',
		redRounds: 1,
		blueRounds: 0
	},
	{
		id: '1',
		mapId: '1',
		modeId: '1',
		date: new Date('2022-01-02T00:00:00.000Z'),
		winningTeam: 'Blue',
		redRounds: 0,
		blueRounds: 1
	},
	{
		id: '2',
		mapId: '2',
		modeId: '2',
		date: new Date('2022-01-03T00:00:00.000Z'),
		winningTeam: 'Red',
		redRounds: 0,
		blueRounds: 0
	}
]

export const mockDbMatches: DB_Match[] = [
	{
		id: '0',
		map_id: '0',
		mode_id: '0',
		date: '2022-01-01T00:00:00.000Z',
		winning_team: 'Red',
		red_rounds: 1,
		blue_rounds: 0
	},
	{
		id: '1',
		map_id: '1',
		mode_id: '1',
		date: '2022-01-02T00:00:00.000Z',
		winning_team: 'Blue',
		red_rounds: 0,
		blue_rounds: 1
	},
	{
		id: '2',
		map_id: '2',
		mode_id: '2',
		date: '2022-01-03T00:00:00.000Z',
		winning_team: 'Red',
		red_rounds: 0,
		blue_rounds: 0
	}
]
