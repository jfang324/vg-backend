import { Player } from '@common/types/player.type'
import { PlayerRepository } from '@modules/database/supabase_repositories/player.repository'

export const mockPlayer = {
	id: '8918b04d-9034-5838-b3ed-dd7ae3efe5e5',
	name: 'Hexennacht',
	tag: 'NA1',
	region: 'na',
	level: 309,
	customization: {
		card: 'bb6ae873-43ec-efb4-3ea6-93ac00a82d4e',
		title: '5c26249f-4396-4bd8-166a-8fbf15ba4219',
		preferred_level_border: 'ebc736cd-4b6a-137b-e2b0-1486e31312c9'
	},
	rank: {
		id: 18,
		name: 'Diamond 1'
	}
} as unknown as Player

export const mockPlayers = [mockPlayer]

export const mockPlayerRepository: jest.Mocked<PlayerRepository> = {
	upsertMany: jest.fn(),
	getById: jest.fn(),
	getManyByIds: jest.fn()
} as unknown as jest.Mocked<PlayerRepository>

jest.mock('@modules/database/supabase_repositories/player.repository', () => ({
	PlayerRepository: jest.fn(() => mockPlayerRepository)
}))
