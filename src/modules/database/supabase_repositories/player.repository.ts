import { Player } from '@common/types/player.type'
import { Database } from '@generated/supabase/database.types'
import { LoggingService } from '@modules/logging/logging.service'
import { Inject, Injectable } from '@nestjs/common'
import { SupabaseClient } from '@supabase/supabase-js'
import { PlayerRepositoryInterface } from '../interfaces/player.repository.interface'
import { Player as DB_Player } from '../types/player.db.type'

@Injectable()
export class PlayerRepository implements PlayerRepositoryInterface {
	constructor(
		@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient<Database>,
		private readonly loggingService: LoggingService
	) {}

	/**
	 * Transform a database player into a domain player
	 * @param dbPlayer The database player to transform
	 * @returns The transformed player
	 */
	mapDbToDomain(dbPlayer: DB_Player): Player {
		return {
			id: dbPlayer.id,
			name: dbPlayer.name,
			tag: dbPlayer.tag,
			region: dbPlayer.region,
			level: dbPlayer.level,
			customization: {
				card: dbPlayer.customization?.card,
				title: dbPlayer.customization?.title,
				preferredLevelBorder: dbPlayer.customization?.preferred_level_border
			},
			rank: {
				id: dbPlayer.rank?.id,
				name: dbPlayer.rank?.name
			}
		}
	}

	/**
	 * Transform a domain player into a database player
	 * @param player The domain player to transform
	 * @returns The transformed player
	 */
	mapDomainToDb(player: Player): DB_Player {
		return {
			id: player.id,
			name: player.name,
			tag: player.tag,
			region: player.region,
			level: player.level,
			customization: {
				card: player.customization?.card,
				title: player.customization?.title,
				preferred_level_border: player.customization?.preferredLevelBorder
			},
			rank: {
				id: player.rank?.id,
				name: player.rank?.name
			}
		}
	}

	/**
	 * Upsert multiple players in the database
	 * @param players The players to upsert
	 * @returns The upserted players
	 */
	async upsertMany(players: Player[]): Promise<Player[]> {
		const dbPlayers = players.map((player) => this.mapDomainToDb(player))

		const { data: _, error } = await this.supabase
			.from('players')
			.upsert(dbPlayers, { onConflict: 'id', ignoreDuplicates: true })

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
		const { data, error } = await this.supabase.from('players').select('*').eq('id', id).single()

		if (error) {
			this.loggingService.logDatabaseError('Player', 'getById', error.message)
			throw new Error(`Failed to retrieve player from database: ${error.message}`)
		}

		const player = this.mapDbToDomain(data as DB_Player)

		return player
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

		const players = data.map((player) => this.mapDbToDomain(player as DB_Player))

		return players
	}
}
