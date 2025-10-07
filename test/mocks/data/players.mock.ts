import { Region } from '@common/constants/regions'
import { Player } from '@common/types/player.type'
import { Player as DB_Player } from '@modules/database/types/player.db.type'

export const mockPlayers: Player[] = [
	{
		id: '0',
		name: 'Player 0',
		tag: 'Tag 0',
		region: 'Region 0' as Region,
		level: 0,
		customization: {
			card: 'Card 0',
			title: 'Title 0',
			preferredLevelBorder: 'Preferred Level Border 0'
		},
		rank: {
			id: 0,
			name: 'Rank 0'
		}
	},
	{
		id: '1',
		name: 'Player 1',
		tag: 'Tag 1',
		region: 'Region 1' as Region,
		level: 1,
		customization: {
			card: 'Card 1',
			title: 'Title 1',
			preferredLevelBorder: 'Preferred Level Border 1'
		},
		rank: {
			id: 1,
			name: 'Rank 1'
		}
	}
]

export const mockDbPlayers: DB_Player[] = [
	{
		id: '0',
		name: 'Player 0',
		tag: 'Tag 0',
		region: 'Region 0' as Region,
		level: 0,
		customization: {
			card: 'Card 0',
			title: 'Title 0',
			preferred_level_border: 'Preferred Level Border 0'
		},
		rank: {
			id: 0,
			name: 'Rank 0'
		}
	},
	{
		id: '1',
		name: 'Player 1',
		tag: 'Tag 1',
		region: 'Region 1' as Region,
		level: 1,
		customization: {
			card: 'Card 1',
			title: 'Title 1',
			preferred_level_border: 'Preferred Level Border 1'
		},
		rank: {
			id: 1,
			name: 'Rank 1'
		}
	}
]
