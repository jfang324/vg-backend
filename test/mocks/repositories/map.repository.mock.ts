import { MapRepository } from '@modules/database/supabase_repositories/map.repository'

export const mockMapRepository: jest.Mocked<MapRepository> = {
	upsertMany: jest.fn(),
	getById: jest.fn()
} as unknown as jest.Mocked<MapRepository>

jest.mock('@modules/database/supabase_repositories/map.repository', () => ({
	MapRepository: jest.fn(() => mockMapRepository)
}))
