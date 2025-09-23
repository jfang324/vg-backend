import { Agent } from '@common/types/agent.type'
import { Database } from '@generated/supabase/database.types'
import { mockLoggingService } from '@mocks/logging.service.mock'
import { mockFrom, mockSupabaseClient, mockUpsert } from '@mocks/supabase.mock'
import { SupabaseClient } from '@supabase/supabase-js'
import { createSupabaseClient } from '../connections/supabase.connection'
import { AgentRepository } from './agent.repository'

jest.mock('@modules/database/connections/supabase.connection', () => ({
	createSupabaseClient: () => mockSupabaseClient
}))

jest.mock('@modules/logging/logging.service', () => ({
	LoggingService: mockLoggingService
}))

describe('AgentRepository', () => {
	let mockSupabaseClient: SupabaseClient<Database>
	let mockAgentRepository: AgentRepository

	beforeEach(() => {
		mockSupabaseClient = createSupabaseClient()
		mockAgentRepository = new AgentRepository(mockSupabaseClient, mockLoggingService)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('it should insert a call upsert if the agent is not cached', async () => {
		const mockAgents: Agent[] = [{ id: 'test-agent-id', name: 'test-agent-name' }]

		const response = await mockAgentRepository.upsertMany(mockAgents)

		expect(mockFrom).toHaveBeenCalledWith('agents')
		expect(mockUpsert).toHaveBeenCalledWith(mockAgents, { onConflict: 'id', ignoreDuplicates: true })
		expect(response).toEqual(mockAgents)
	})

	it('it should not insert a call upsert if the agent is cached', async () => {
		const mockAgents: Agent[] = [{ id: 'test-agent-id', name: 'test-agent-name' }]

		const response = await mockAgentRepository.upsertMany(mockAgents)
		const response2 = await mockAgentRepository.upsertMany(mockAgents)

		expect(mockFrom).toHaveBeenCalledWith('agents')
		expect(mockFrom).toHaveBeenCalledTimes(1)
		expect(mockUpsert).toHaveBeenCalledTimes(1)
		expect(mockUpsert).toHaveBeenCalledWith(mockAgents, { onConflict: 'id', ignoreDuplicates: true })
		expect(response).toEqual(mockAgents)
		expect(response2).toEqual(mockAgents)
	})
})
