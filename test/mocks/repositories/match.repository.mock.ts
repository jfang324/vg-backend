import { MatchRepository } from '@modules/database/supabase_repositories/match.repository'

export const mockMatchRepository: jest.Mocked<MatchRepository> = {
	upsertMany: jest.fn()
} as unknown as jest.Mocked<MatchRepository>

jest.mock('@modules/database/supabase_repositories/match.repository', () => ({
	MatchRepository: jest.fn(() => mockMatchRepository)
}))
