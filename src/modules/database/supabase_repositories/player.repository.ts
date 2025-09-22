import { Player } from '@common/types/player.type'
import { Database } from '@generated/supabase/database.types'
import { LoggingService } from '@modules/logging/logging.service'
import { Inject, Injectable } from '@nestjs/common'
import { SupabaseClient } from '@supabase/supabase-js'
import { PlayerRepositoryInterface } from '../interfaces/player.repository.interface'

@Injectable()
export class PlayerRepository implements PlayerRepositoryInterface {
	constructor(
		@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient<Database>,
		private readonly loggingService: LoggingService
	) {}

	/**
	 * Upsert multiple players in the database
	 * @param players The players to upsert
	 * @returns The upserted players
	 */
	async upsertMany(players: Player[]): Promise<Player[]> {
		const { data: _, error } = await this.supabase
			.from('players')
			.upsert(players, { onConflict: 'id', ignoreDuplicates: true })

		if (error) {
			this.loggingService.logDatabaseError('Player', error.message)
		}

		return players
	}
}
