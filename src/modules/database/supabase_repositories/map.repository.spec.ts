import { Map } from '@common/types/map.type'
import { Database } from '@generated/supabase/database.types'
import { mockLoggingService } from '@mocks/services/logging.service.mock'
import { mockFrom, mockSupabaseClient, mockUpsert } from '@mocks/supabase.mock'
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
		mockFrom.mockImplementation(() => {
			throw new Error('Something went wrong')
		})

		try {
			await mapRepository.upsertMany(mockMaps)
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(Error)

			if (error instanceof Error) {
				expect(error.message).toBe('Something went wrong')
			}
		}
	})
})
