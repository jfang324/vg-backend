import { ModeRepository } from '@modules/database/supabase_repositories/mode.repository'

export const mockModeRepository: jest.Mocked<ModeRepository> = {
	upsertMany: jest.fn()
} as unknown as jest.Mocked<ModeRepository>

jest.mock('@modules/database/supabase_repositories/mode.repository', () => ({
	ModeRepository: jest.fn(() => mockModeRepository)
}))
