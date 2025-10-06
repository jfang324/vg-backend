import { Mode } from '@common/types/mode.type'
import { ModeRepository } from '@modules/database/supabase_repositories/mode.repository'

export const mockMode = {
	id: 'competitive',
	name: 'Competitive',
	mode_type: 'Standard'
} as unknown as Mode

export const mockModeRepository: jest.Mocked<ModeRepository> = {
	upsertMany: jest.fn(),
	getByName: jest.fn(),
	getById: jest.fn()
} as unknown as jest.Mocked<ModeRepository>

jest.mock('@modules/database/supabase_repositories/mode.repository', () => ({
	ModeRepository: jest.fn(() => mockModeRepository)
}))
