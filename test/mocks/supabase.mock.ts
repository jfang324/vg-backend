import { Database } from '@generated/supabase/database.types'
import { SupabaseClient } from '@supabase/supabase-js'

export const mockUpsert = jest.fn().mockImplementation((data: unknown, _: any) => {
	return data
})

export const mockFrom = jest.fn().mockImplementation((_: string) => ({
	upsert: mockUpsert
}))

export const mockSupabaseClient: jest.Mocked<SupabaseClient<Database>> = {
	from: mockFrom
} as unknown as jest.Mocked<SupabaseClient<Database>>

jest.mock('@modules/database/connections/supabase.connection', () => ({
	createSupabaseClient: () => {
		return mockSupabaseClient
	}
}))
