import { Agent } from '@common/types/agent.type'
import { Database } from '@generated/supabase/database.types'
import { mockLoggingService } from '@mocks/services/logging.service.mock'
import { mockFrom, mockIn, mockSelect, mockSupabaseClient, mockUpsert } from '@mocks/supabase.mock'
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
	let agentRepository: AgentRepository

	beforeEach(() => {
		mockSupabaseClient = createSupabaseClient()
		agentRepository = new AgentRepository(mockSupabaseClient, mockLoggingService)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('it should insert a call upsert if the agent is not cached', async () => {
		const mockAgents: Agent[] = [{ id: 'test-agent-id', name: 'test-agent-name' }]

		const response = await agentRepository.upsertMany(mockAgents)

		expect(mockFrom).toHaveBeenCalledWith('agents')
		expect(mockUpsert).toHaveBeenCalledWith(mockAgents, { onConflict: 'id', ignoreDuplicates: true })
		expect(response).toEqual(mockAgents)
	})

	it('it should not insert a call upsert if the agent is cached', async () => {
		const mockAgents: Agent[] = [{ id: 'test-agent-id', name: 'test-agent-name' }]

		const response = await agentRepository.upsertMany(mockAgents)
		const response2 = await agentRepository.upsertMany(mockAgents)

		expect(mockFrom).toHaveBeenCalledWith('agents')
		expect(mockFrom).toHaveBeenCalledTimes(1)
		expect(mockUpsert).toHaveBeenCalledTimes(1)
		expect(mockUpsert).toHaveBeenCalledWith(mockAgents, { onConflict: 'id', ignoreDuplicates: true })
		expect(response).toEqual(mockAgents)
		expect(response2).toEqual(mockAgents)
	})

	it('it should throw an error if the upsertMany call fails', async () => {
		const mockAgents: Agent[] = [{ id: 'test-agent-id', name: 'test-agent-name' }]
		mockUpsert.mockReturnValueOnce({ error: new Error('Something went wrong') })

		const response = await agentRepository.upsertMany(mockAgents)

		expect(mockFrom).toHaveBeenCalledWith('agents')
		expect(mockLoggingService.logDatabaseError).toHaveBeenCalledWith('Agent', 'upsertMany', 'Something went wrong')
		expect(response).toEqual(mockAgents)
	})

	it('it should find many agents by their ids', async () => {
		const mockAgents: Agent[] = [
			{ id: 'test-agent-id', name: 'test-agent-name' },
			{ id: 'test-agent-id-2', name: 'test-agent-name-2' }
		]
		mockIn.mockReturnValueOnce({ data: mockAgents })

		const response = await agentRepository.getManyByIds(mockAgents.map((agent) => agent.id))

		expect(mockFrom).toHaveBeenCalledWith('agents')
		expect(mockFrom).toHaveBeenCalledTimes(1)
		expect(mockSelect).toHaveBeenCalledWith('*')
		expect(mockIn).toHaveBeenCalledWith(
			'id',
			mockAgents.map((agent) => agent.id)
		)
		expect(response).toEqual(mockAgents)
	})

	it('it should log an error if the findManyByIds call fails', async () => {
		const mockAgents: Agent[] = [{ id: 'test-agent-id', name: 'test-agent-name' }]
		mockIn.mockReturnValueOnce({ data: mockAgents, error: new Error('Something went wrong') })

		const response = await agentRepository.getManyByIds(['test-agent-id'])

		expect(mockFrom).toHaveBeenCalledWith('agents')
		expect(mockFrom).toHaveBeenCalledTimes(1)
		expect(mockLoggingService.logDatabaseError).toHaveBeenCalledWith(
			'Agent',
			'getManyByIds',
			'Something went wrong'
		)
		expect(response).toEqual([])
	})
})
