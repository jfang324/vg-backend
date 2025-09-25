import { Database } from '@generated/supabase/database.types'
import { SupabaseClient } from '@supabase/supabase-js'

export const mockUpsert = jest.fn().mockImplementation((data: unknown, _: any) => {
	return data
})

export const mockFrom = jest.fn().mockImplementation((_: string) => ({
	upsert: mockUpsert,
	select: mockSelect
}))

export const mockSingle = jest.fn().mockImplementation((data: unknown[]) => {
	return data[0] || null
})

export const mockEq = jest.fn().mockImplementation((_: string) => {
	return {
		single: mockSingle
	}
})

export const mockSelect = jest.fn().mockImplementation((_: string) => ({
	eq: mockEq
}))

export const mockSupabaseClient: jest.Mocked<SupabaseClient<Database>> = {
	from: mockFrom
} as unknown as jest.Mocked<SupabaseClient<Database>>

jest.mock('@modules/database/connections/supabase.connection', () => ({
	createSupabaseClient: () => {
		return mockSupabaseClient
	}
}))
