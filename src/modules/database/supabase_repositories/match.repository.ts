import { Match } from '@common/types/match.type'
import { Database } from '@generated/supabase/database.types'
import { LoggingService } from '@modules/logging/logging.service'
import { Inject, Injectable } from '@nestjs/common'
import { SupabaseClient } from '@supabase/supabase-js'
import { MatchRepositoryInterface } from '../interfaces/match.repository.interface'
import { Match as DB_Match } from '../types/match.db.type'

@Injectable()
export class MatchRepository implements MatchRepositoryInterface {
	constructor(
		@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient<Database>,
		private readonly loggingService: LoggingService
	) {}

	/**
	 * Transform a database match into a domain match
	 * @param dbMatch The database match to transform
	 * @returns The transformed match
	 */
	mapDbToDomain(dbMatch: DB_Match): Match {
		return {
			id: dbMatch.id,
			mapId: dbMatch.map_id,
			modeId: dbMatch.mode_id,
			date: new Date(dbMatch.date),
			winningTeam: dbMatch.winning_team,
			redRounds: dbMatch.red_rounds,
			blueRounds: dbMatch.blue_rounds
		}
	}

	/**
	 * Transform a domain match into a database match
	 * @param match The domain match to transform
	 * @returns The transformed match
	 */
	mapDomainToDb(match: Match): DB_Match {
		return {
			id: match.id,
			map_id: match.mapId,
			mode_id: match.modeId,
			date: match.date.toISOString(),
			winning_team: match.winningTeam,
			red_rounds: match.redRounds,
			blue_rounds: match.blueRounds
		}
	}

	/**
	 * Upsert multiple matches in the database
	 * @param matches The matches to upsert
	 * @returns The upserted matches
	 */
	async upsertMany(matches: Match[]): Promise<Match[]> {
		const dbMatches = matches.map((match) => this.mapDomainToDb(match))

		const { data: _, error } = await this.supabase.from('matches').upsert(dbMatches, {
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
		const { data, error } = await this.supabase.from('matches').select('*').eq('id', id).maybeSingle()

		if (error) {
			this.loggingService.logDatabaseError('Match', 'getById', error.message)
		}

		if (!data) {
			return null
		}

		const match = this.mapDbToDomain(data)

		return match
	}
}
