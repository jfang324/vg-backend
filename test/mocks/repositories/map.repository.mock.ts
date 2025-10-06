import { Map as GameMap } from '@common/types/map.type'
import { MapRepository } from '@modules/database/supabase_repositories/map.repository'

export const mockMap = {
	id: '2fe4ed3a-450a-948b-6d6b-e89a78e680a9',
	name: 'Lotus'
} as unknown as GameMap

export const mockMapRepository: jest.Mocked<MapRepository> = {
	upsertMany: jest.fn(),
	getById: jest.fn()
} as unknown as jest.Mocked<MapRepository>

jest.mock('@modules/database/supabase_repositories/map.repository', () => ({
	MapRepository: jest.fn(() => mockMapRepository)
}))
