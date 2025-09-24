import { PlayerRepository } from '@modules/database/supabase_repositories/player.repository'

export const mockPlayerRepository: jest.Mocked<PlayerRepository> = {
	upsertMany: jest.fn()
} as unknown as jest.Mocked<PlayerRepository>

jest.mock('@modules/database/supabase_repositories/player.repository', () => ({
	PlayerRepository: jest.fn(() => mockPlayerRepository)
}))
