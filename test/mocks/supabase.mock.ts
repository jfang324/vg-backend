import { Database } from '@generated/supabase/database.types'
import { SupabaseClient } from '@supabase/supabase-js'

export const mockSingle = jest.fn().mockImplementation((_: string) => ({
	data: null,
	error: null
}))

export const mockUpsert = jest.fn().mockImplementation((_: unknown) => ({
	data: null,
	error: null
}))

export const mockIn = jest.fn().mockImplementation((_: string, __: unknown) => ({
	data: [],
	error: null,
	single: mockSingle
}))

export const mockEq = jest.fn().mockImplementation((_: string, __: unknown) => ({
	data: [],
	error: null,
	single: mockSingle
}))

export const mockSelect = jest.fn().mockImplementation((_: string) => ({
	eq: mockEq,
	in: mockIn
}))

export const mockFrom = jest.fn().mockImplementation((_: string) => ({
	select: mockSelect,
	upsert: mockUpsert
}))

export const mockSupabaseClient: jest.Mocked<SupabaseClient<Database>> = {
	from: mockFrom
} as unknown as jest.Mocked<SupabaseClient<Database>>
