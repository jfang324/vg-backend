import { Match } from '@common/types/match.type'
import { Database } from '@generated/supabase/database.types'
import { LoggingService } from '@modules/logging/logging.service'
import { Inject, Injectable } from '@nestjs/common'
import { SupabaseClient } from '@supabase/supabase-js'
import { MatchRepositoryInterface } from '../interfaces/match.repository.interface'

@Injectable()
export class MatchRepository implements MatchRepositoryInterface {
	constructor(
		@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient<Database>,
		private readonly loggingService: LoggingService
	) {}

	/**
	 * Upsert multiple matches in the database
	 * @param matches The matches to upsert
	 * @returns The upserted matches
	 */
	async upsertMany(matches: Match[]): Promise<Match[]> {
		const { data: _, error } = await this.supabase
			.from('matches')
			.upsert(matches as unknown as Database['public']['Tables']['matches']['Insert'][], {
				onConflict: 'id',
				ignoreDuplicates: true
			})

		if (error) {
			this.loggingService.logDatabaseError('Match', 'upsertMany', error.message)
		}

		return matches
	}

	/**
	 * Find a match by its id
	 * @param id The id of the match to find
	 * @returns The found match
	 */
	async getById(id: string): Promise<Match | null> {
		const { data, error } = await this.supabase.from('matches').select('*').eq('id', id)

		if (error) {
			this.loggingService.logDatabaseError('Match', 'getById', error.message)
		}

		if (!data) {
			return null
		}

		return {
			...data[0],
			date: new Date(data[0].date)
		}
	}
}
