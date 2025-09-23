import { Database } from '@generated/supabase/database.types'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export function createSupabaseClient(): SupabaseClient<Database> {
	const url = process.env.SUPABASE_URL
	const key = process.env.SUPABASE_KEY

	if (!url || !key) {
		throw new Error('SUPABASE_URL and SUPABASE_KEY must be set')
	}

	return createClient<Database>(url, key)
}
