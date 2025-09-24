import { AgentRepository } from '@modules/database/supabase_repositories/agent.repository'

export const mockAgentRepository: jest.Mocked<AgentRepository> = {
	upsertMany: jest.fn()
} as unknown as jest.Mocked<AgentRepository>

jest.mock('@modules/database/supabase_repositories/agent.repository', () => ({
	AgentRepository: jest.fn(() => mockAgentRepository)
}))
