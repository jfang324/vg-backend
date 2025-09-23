import { Map } from '@common/types/map.type'
import { Database } from '@generated/supabase/database.types'
import { mockLoggingService } from '@mocks/logging.service.mock'
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
	let mockMapRepository: MapRepository

	beforeEach(() => {
		mockSupabaseClient = createSupabaseClient()
		mockMapRepository = new MapRepository(mockSupabaseClient, mockLoggingService)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('it should insert a call upsert if the map is not cached', async () => {
		const mockMaps: Map[] = [{ id: 'test-map-id', name: 'test-map-name' }]

		const response = await mockMapRepository.upsertMany(mockMaps)

		expect(mockFrom).toHaveBeenCalledWith('maps')
		expect(mockUpsert).toHaveBeenCalledWith(mockMaps, { onConflict: 'id', ignoreDuplicates: true })
		expect(response).toEqual(mockMaps)
	})

	it('it should not insert a call upsert if the map is cached', async () => {
		const mockMaps: Map[] = [{ id: 'test-map-id', name: 'test-map-name' }]

		const response = await mockMapRepository.upsertMany(mockMaps)
		const response2 = await mockMapRepository.upsertMany(mockMaps)

		expect(mockFrom).toHaveBeenCalledWith('maps')
		expect(mockFrom).toHaveBeenCalledTimes(1)
		expect(mockUpsert).toHaveBeenCalledTimes(1)
		expect(mockUpsert).toHaveBeenCalledWith(mockMaps, { onConflict: 'id', ignoreDuplicates: true })
		expect(response).toEqual(mockMaps)
		expect(response2).toEqual(mockMaps)
	})
})
