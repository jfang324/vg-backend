import { Mode } from '@common/types/mode.type'
import { Database } from '@generated/supabase/database.types'
import { mockLoggingService } from '@mocks/services/logging.service.mock'
import { mockFrom, mockSupabaseClient, mockUpsert } from '@mocks/supabase.mock'
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

	it('it should insert a call upsert if the mode is not cached', async () => {
		const mockModes: Mode[] = [{ id: 'test-mode-id', name: 'test-mode-name', mode_type: 'test-mode-type' }]

		const response = await modeRepository.upsertMany(mockModes)

		expect(mockFrom).toHaveBeenCalledWith('modes')
		expect(mockUpsert).toHaveBeenCalledWith(mockModes, { onConflict: 'id', ignoreDuplicates: true })
		expect(response).toEqual(mockModes)
	})

	it('it should not insert a call upsert if the mode is cached', async () => {
		const mockModes: Mode[] = [{ id: 'test-mode-id', name: 'test-mode-name', mode_type: 'test-mode-type' }]

		const response = await modeRepository.upsertMany(mockModes)
		const response2 = await modeRepository.upsertMany(mockModes)

		expect(mockFrom).toHaveBeenCalledWith('modes')
		expect(mockFrom).toHaveBeenCalledTimes(1)
		expect(mockUpsert).toHaveBeenCalledTimes(1)
		expect(mockUpsert).toHaveBeenCalledWith(mockModes, { onConflict: 'id', ignoreDuplicates: true })
		expect(response).toEqual(mockModes)
		expect(response2).toEqual(mockModes)
	})

	it('it should throw an error if the upsertMany call fails', async () => {
		const mockModes: Mode[] = [{ id: 'test-mode-id', name: 'test-mode-name', mode_type: 'test-mode-type' }]
		mockFrom.mockImplementation(() => {
			throw new Error('Something went wrong')
		})

		try {
			await modeRepository.upsertMany(mockModes)
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(Error)

			if (error instanceof Error) {
				expect(error.message).toBe('Something went wrong')
			}
		}
	})
})
