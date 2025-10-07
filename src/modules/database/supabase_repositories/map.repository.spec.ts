import { Database } from '@generated/supabase/database.types'
import { mockDbMaps, mockMaps } from '@mocks/data/maps.mock'
import { mockLoggingService } from '@mocks/services/logging.service.mock'
import { mockEq, mockFrom, mockSelect, mockSingle, mockSupabaseClient, mockUpsert } from '@mocks/supabase.mock'
import { SupabaseClient } from '@supabase/supabase-js'
import { createSupabaseClient } from '../connections/supabase.connection'
import { MapRepository } from './map.repository'

jest.mock('@modules/database/connections/supabase.connection', () => ({
	createSupabaseClient: () => mockSupabaseClient
}))

jest.mock('@modules/logging/logging.service', () => ({
	LoggingService: mockLoggingService
}))

describe('MapRepository', () => {
	let mockSupabaseClient: SupabaseClient<Database>
	let mapRepository: MapRepository

	beforeEach(() => {
		mockSupabaseClient = createSupabaseClient()
		mapRepository = new MapRepository(mockSupabaseClient, mockLoggingService)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should upsert to the database if the maps are not cached', async () => {
		const response = await mapRepository.upsertMany(mockMaps)

		expect(mockFrom).toHaveBeenCalledWith('maps')
		expect(mockUpsert).toHaveBeenCalledWith(mockDbMaps, expect.anything())
		expect(response).toEqual(mockMaps)
	})

	it('should not upsert to the database if the maps are cached', async () => {
		const response1 = await mapRepository.upsertMany(mockMaps)
		const response2 = await mapRepository.upsertMany(mockMaps)

		expect(mockUpsert).toHaveBeenCalledTimes(1)
		expect(response1).toEqual(response2)
	})

	it('should log an error if the upsertMany call fails', async () => {
		const mockError = { error: new Error('Something went wrong') }
		mockUpsert.mockReturnValueOnce(mockError)

		const response = await mapRepository.upsertMany(mockMaps)

		expect(mockFrom).toHaveBeenCalledWith('maps')
		expect(mockLoggingService.logDatabaseError).toHaveBeenCalledWith('Map', 'upsertMany', 'Something went wrong')
		expect(response).toEqual(mockMaps)
	})

	it('should return the full maps from the database if the ids are not cached', async () => {
		mockSingle.mockReturnValueOnce({ data: mockDbMaps[0] })
		const mockId = mockMaps[0].id

		const response = await mapRepository.getById(mockId)

		expect(mockFrom).toHaveBeenCalledWith('maps')
		expect(mockSelect).toHaveBeenCalledWith('*')
		expect(mockSelect).toHaveBeenCalledTimes(1)
		expect(mockEq).toHaveBeenCalledWith('id', mockId)
		expect(response).toEqual(mockMaps[0])
	})

	it('it should retrieve a map from the cache if it is cached', async () => {
		mockSingle.mockReturnValueOnce({ data: mockDbMaps[0] })
		const mockId = mockMaps[0].id

		const response1 = await mapRepository.getById(mockId)
		const response2 = await mapRepository.getById(mockId)

		expect(mockFrom).toHaveBeenCalledTimes(1)
		expect(mockSelect).toHaveBeenCalledTimes(1)
		expect(mockEq).toHaveBeenCalledTimes(1)
		expect(response1).toEqual(response2)
	})

	it('it should return null and log an error if the map is not found', async () => {
		const mockError = { error: new Error('Something went wrong') }
		const mockId = mockMaps[0].id
		mockSingle.mockReturnValueOnce(mockError)

		const response = await mapRepository.getById(mockId)

		expect(mockLoggingService.logDatabaseError).toHaveBeenCalledWith('Map', 'getById', 'Something went wrong')
		expect(response).toEqual(null)
	})
})
