import { Match } from '@common/types/match.type'
import { MatchRepository } from '@modules/database/supabase_repositories/match.repository'

export const mockMatch = {
	id: 'a181a03a-c839-4f87-9ac7-dcd2975da17f',
	map_id: '2fe4ed3a-450a-948b-6d6b-e89a78e680a9',
	mode_id: 'competitive',
	date: '2025-09-22T19:35:53.928Z',
	winning_team: 'Red'
} as unknown as Match

export const mockMatchRepository: jest.Mocked<MatchRepository> = {
	upsertMany: jest.fn(),
	getById: jest.fn()
} as unknown as jest.Mocked<MatchRepository>

jest.mock('@modules/database/supabase_repositories/match.repository', () => ({
	MatchRepository: jest.fn(() => mockMatchRepository)
}))
