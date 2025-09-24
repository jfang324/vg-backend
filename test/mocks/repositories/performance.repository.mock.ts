import { PerformanceRepository } from '@modules/database/supabase_repositories/performance.repository'

export const mockPerformanceRepository: jest.Mocked<PerformanceRepository> = {
	upsertMany: jest.fn()
} as unknown as jest.Mocked<PerformanceRepository>

jest.mock('@modules/database/supabase_repositories/performance.repository', () => ({
	PerformanceRepository: jest.fn(() => mockPerformanceRepository)
}))
