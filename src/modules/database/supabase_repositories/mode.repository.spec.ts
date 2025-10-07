import { Database } from '@generated/supabase/database.types'
import { mockDbModes, mockModes } from '@mocks/data/modes.mock'
import { mockLoggingService } from '@mocks/services/logging.service.mock'
import { mockEq, mockFrom, mockSelect, mockSingle, mockSupabaseClient, mockUpsert } from '@mocks/supabase.mock'
import { SupabaseClient } from '@supabase/supabase-js'
import { createSupabaseClient } from '../connections/supabase.connection'
import { ModeRepository } from './mode.repository'

jest.mock('@modules/database/connections/supabase.connection', () => ({
	createSupabaseClient: () => mockSupabaseClient
}))

jest.mock('@modules/logging/logging.service', () => ({
	LoggingService: mockLoggingService
}))

describe('ModeRepository', () => {
	let mockSupabaseClient: SupabaseClient<Database>
	let modeRepository: ModeRepository

	beforeEach(() => {
		mockSupabaseClient = createSupabaseClient()
		modeRepository = new ModeRepository(mockSupabaseClient, mockLoggingService)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should upsert to the database if the modes are not cached', async () => {
		const response = await modeRepository.upsertMany(mockModes)

		expect(mockFrom).toHaveBeenCalledWith('modes')
		expect(mockUpsert).toHaveBeenCalledWith(mockDbModes, expect.anything())
		expect(response).toEqual(mockModes)
	})

	it('should not upsert to the database if the modes are cached', async () => {
		const response1 = await modeRepository.upsertMany(mockModes)
		const response2 = await modeRepository.upsertMany(mockModes)

		expect(mockUpsert).toHaveBeenCalledTimes(1)
		expect(response1).toEqual(response2)
	})

	it('should log an error if the upsertMany call fails', async () => {
		const mockError = { error: new Error('Something went wrong') }
		mockUpsert.mockReturnValueOnce(mockError)

		const response = await modeRepository.upsertMany(mockModes)

		expect(mockFrom).toHaveBeenCalledWith('modes')
		expect(mockLoggingService.logDatabaseError).toHaveBeenCalledWith('Mode', 'upsertMany', 'Something went wrong')
		expect(response).toEqual(mockModes)
	})

	it('should return the full modes from the database if the name are not cached', async () => {
		mockSingle.mockReturnValueOnce({ data: mockDbModes[0] })
		const mockName = mockModes[0].name

		const response = await modeRepository.getByName(mockName)

		expect(mockFrom).toHaveBeenCalledWith('modes')
		expect(mockSelect).toHaveBeenCalledWith('*')
		expect(mockEq).toHaveBeenCalledWith('name', mockName)
		expect(response).toEqual(mockModes[0])
	})

	it('should return the full modes from the cache if the name are cached', async () => {
		mockSingle.mockReturnValueOnce({ data: mockDbModes[0] })
		const mockName = mockModes[0].name

		const response1 = await modeRepository.getByName(mockName)
		const response2 = await modeRepository.getByName(mockName)

		expect(mockFrom).toHaveBeenCalledTimes(1)
		expect(mockSelect).toHaveBeenCalledTimes(1)
		expect(mockEq).toHaveBeenCalledTimes(1)
		expect(response1).toEqual(response2)
	})

	it('should log an error if the getByName call fails', async () => {
		const mockError = { error: new Error('Something went wrong') }
		const mockName = mockModes[0].name
		mockSingle.mockResolvedValueOnce(mockError)

		const response = await modeRepository.getByName(mockName)

		expect(mockLoggingService.logDatabaseError).toHaveBeenCalledWith('Mode', 'getByName', 'Something went wrong')
		expect(response).toEqual(null)
	})

	it('should return the full modes from the database if the ids are not cached', async () => {
		mockSingle.mockReturnValueOnce({ data: mockDbModes[0] })
		const mockId = mockModes[0].id

		const response = await modeRepository.getById(mockId)

		expect(mockFrom).toHaveBeenCalledWith('modes')
		expect(mockSelect).toHaveBeenCalledWith('*')
		expect(mockEq).toHaveBeenCalledWith('id', mockId)
		expect(response).toEqual(mockModes[0])
	})

	it('should return the full modes from the local cache if the ids are cached', async () => {
		mockSingle.mockResolvedValueOnce({ data: mockDbModes[0] })
		const mockId = mockModes[0].id

		const response1 = await modeRepository.getById(mockId)
		const response2 = await modeRepository.getById(mockId)

		expect(mockFrom).toHaveBeenCalledTimes(1)
		expect(mockSelect).toHaveBeenCalledTimes(1)
		expect(mockEq).toHaveBeenCalledTimes(1)
		expect(response1).toEqual(response2)
	})

	it('should log an error if the getById call fails', async () => {
		const mockError = { error: new Error('Something went wrong') }
		const mockId = mockModes[0].id
		mockSingle.mockResolvedValueOnce(mockError)

		const response = await modeRepository.getById(mockId)

		expect(mockLoggingService.logDatabaseError).toHaveBeenCalledWith('Mode', 'getById', 'Something went wrong')
		expect(response).toEqual(null)
	})
})
