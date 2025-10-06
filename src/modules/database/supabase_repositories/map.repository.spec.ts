import { Map } from '@common/types/map.type'
import { Database } from '@generated/supabase/database.types'
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

	it('it should insert a call upsert if the map is not cached', async () => {
		const mockMaps: Map[] = [{ id: 'test-map-id', name: 'test-map-name' }]

		const response = await mapRepository.upsertMany(mockMaps)

		expect(mockFrom).toHaveBeenCalledWith('maps')
		expect(mockUpsert).toHaveBeenCalledWith(mockMaps, { onConflict: 'id', ignoreDuplicates: true })
		expect(response).toEqual(mockMaps)
	})

	it('it should not insert a call upsert if the map is cached', async () => {
		const mockMaps: Map[] = [{ id: 'test-map-id', name: 'test-map-name' }]

		const response = await mapRepository.upsertMany(mockMaps)
		const response2 = await mapRepository.upsertMany(mockMaps)

		expect(mockFrom).toHaveBeenCalledWith('maps')
		expect(mockFrom).toHaveBeenCalledTimes(1)
		expect(mockUpsert).toHaveBeenCalledTimes(1)
		expect(mockUpsert).toHaveBeenCalledWith(mockMaps, { onConflict: 'id', ignoreDuplicates: true })
		expect(response).toEqual(mockMaps)
		expect(response2).toEqual(mockMaps)
	})

	it('it should throw an error if the upsertMany call fails', async () => {
		const mockMaps: Map[] = [{ id: 'test-map-id', name: 'test-map-name' }]
		mockUpsert.mockReturnValueOnce({ error: new Error('Something went wrong') })

		await mapRepository.upsertMany(mockMaps)

		expect(mockFrom).toHaveBeenCalledWith('maps')
		expect(mockLoggingService.logDatabaseError).toHaveBeenCalledWith('Map', 'upsertMany', 'Something went wrong')
	})

	it('it should retrieve a map from the database if it is not cached', async () => {
		const mockMaps: Map[] = [{ id: 'test-map-id', name: 'test-map-name' }]
		mockSingle.mockReturnValueOnce({ data: mockMaps[0] })

		const response = await mapRepository.getById(mockMaps[0].id)

		expect(mockFrom).toHaveBeenCalledWith('maps')
		expect(mockFrom).toHaveBeenCalledTimes(1)
		expect(mockSelect).toHaveBeenCalledWith('*')
		expect(mockSelect).toHaveBeenCalledTimes(1)
		expect(mockEq).toHaveBeenCalledWith('id', 'test-map-id')
		expect(mockEq).toHaveBeenCalledTimes(1)
		expect(response).toEqual(mockMaps[0])
	})

	it('it should retrieve a map from the cache if it is cached', async () => {
		const mockMaps: Map[] = [{ id: 'test-map-id', name: 'test-map-name' }]
		mockSingle.mockReturnValueOnce({ data: mockMaps[0] })

		await mapRepository.getById(mockMaps[0].id)
		const response = await mapRepository.getById(mockMaps[0].id)

		expect(mockFrom).toHaveBeenCalledWith('maps')
		expect(mockFrom).toHaveBeenCalledTimes(1)
		expect(mockSelect).toHaveBeenCalledWith('*')
		expect(mockSelect).toHaveBeenCalledTimes(1)
		expect(mockEq).toHaveBeenCalledWith('id', 'test-map-id')
		expect(mockEq).toHaveBeenCalledTimes(1)
		expect(response).toEqual(mockMaps[0])
	})

	it('it should return null and log an error if the map is not found', async () => {
		const mockMaps: Map[] = [{ id: 'test-map-id', name: 'test-map-name' }]
		mockSingle.mockReturnValueOnce({ error: new Error('Something went wrong') })

		const response = await mapRepository.getById(mockMaps[0].id)

		expect(mockFrom).toHaveBeenCalledWith('maps')
		expect(mockFrom).toHaveBeenCalledTimes(1)
		expect(mockSelect).toHaveBeenCalledWith('*')
		expect(mockSelect).toHaveBeenCalledTimes(1)
		expect(mockEq).toHaveBeenCalledWith('id', 'test-map-id')
		expect(mockEq).toHaveBeenCalledTimes(1)
		expect(response).toEqual(null)
		expect(mockLoggingService.logDatabaseError).toHaveBeenCalledWith('Map', 'getById', 'Something went wrong')
	})
})
