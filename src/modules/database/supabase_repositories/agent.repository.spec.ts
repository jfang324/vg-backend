import { Database } from '@generated/supabase/database.types'
import { mockAgents, mockDbAgents } from '@mocks/data/agents.mock'
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

	it('should upsert to the database if the agents are not cached', async () => {
		const response = await agentRepository.upsertMany(mockAgents)

		expect(mockFrom).toHaveBeenCalledWith('agents')
		expect(mockUpsert).toHaveBeenCalledWith(mockDbAgents, expect.anything())
		expect(response).toEqual(mockAgents)
	})

	it('should not upsert to the database if the agents are cached', async () => {
		const response1 = await agentRepository.upsertMany(mockAgents)
		const response2 = await agentRepository.upsertMany(mockAgents)

		expect(mockUpsert).toHaveBeenCalledTimes(1)
		expect(response1).toEqual(response2)
	})

	it('should log an error if the upsertMany call fails', async () => {
		const mockError = { error: new Error('Something went wrong') }
		mockUpsert.mockReturnValueOnce(mockError)

		const response = await agentRepository.upsertMany(mockAgents)

		expect(mockFrom).toHaveBeenCalledWith('agents')
		expect(mockLoggingService.logDatabaseError).toHaveBeenCalledWith('Agent', 'upsertMany', 'Something went wrong')
		expect(response).toEqual(mockAgents)
	})

	it('should return the full agents from the database if the ids are not cached', async () => {
		mockIn.mockReturnValueOnce({ data: mockDbAgents })
		const mockIds = mockAgents.map((agent) => agent.id)

		const response = await agentRepository.getManyByIds(mockIds)

		expect(mockFrom).toHaveBeenCalledWith('agents')
		expect(mockSelect).toHaveBeenCalledWith('*')
		expect(mockIn).toHaveBeenCalledWith('id', mockIds)
		expect(response).toEqual(mockAgents)
	})

	it('should return the full agents from the cache if the ids are cached', async () => {
		mockIn.mockReturnValueOnce({ data: mockDbAgents })
		const mockIds = mockAgents.map((agent) => agent.id)

		const response1 = await agentRepository.getManyByIds(mockIds)
		const response2 = await agentRepository.getManyByIds(mockIds)

		expect(mockFrom).toHaveBeenCalledTimes(1)
		expect(mockSelect).toHaveBeenCalledTimes(1)
		expect(mockIn).toHaveBeenCalledTimes(1)
		expect(response1).toEqual(response2)
	})

	it('should log an error if the findManyByIds call fails', async () => {
		const mockError = { error: new Error('Something went wrong') }
		const mockIds = mockAgents.map((agent) => agent.id)
		mockIn.mockReturnValueOnce(mockError)

		const response = await agentRepository.getManyByIds(mockIds)

		expect(mockLoggingService.logDatabaseError).toHaveBeenCalledWith(
			'Agent',
			'getManyByIds',
			'Something went wrong'
		)
		expect(response).toEqual([])
	})
})
