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
			this.loggingService.logDatabaseError('Player', 'upsertMany', error.message)
		}

		return players
	}

	/**
	 * Get a player by their id
	 * @param id The id of the player to get
	 * @returns The player with the given id
	 */
	async getById(id: string): Promise<Player> {
		const { data: player, error } = await this.supabase.from('players').select('*').eq('id', id).single()

		if (error) {
			this.loggingService.logDatabaseError('Player', 'getById', error.message)
			throw new Error(`Failed to retrieve player from database: ${error.message}`)
		}

		return player as Player
	}

	/**
	 * Find players by their ids
	 * @param ids The ids of the players to find
	 * @returns The found players
	 */
	async getManyByIds(ids: string[]): Promise<Player[]> {
		const { data, error } = await this.supabase.from('players').select('*').in('id', ids)

		if (error) {
			this.loggingService.logDatabaseError('Player', 'findManyByIds', error.message)
			return []
		}

		return data as Player[]
	}
}
