import { Map as GameMap } from '@common/types/map.type'
import { Database } from '@generated/supabase/database.types'
import { LoggingService } from '@modules/logging/logging.service'
import { Inject, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common'
import { SupabaseClient } from '@supabase/supabase-js'
import { MapRepositoryInterface } from '../interfaces/map.repository.interface'

@Injectable()
export class MapRepository implements MapRepositoryInterface, OnModuleInit {
	private localMaps: Map<string, GameMap> = new Map()

	constructor(
		@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient<Database>,
		private readonly loggingService: LoggingService
	) {}

	/**
	 * On module init, retrieve all maps from the database and store them locally
	 */
	async onModuleInit() {
		const { data, error } = await this.supabase.from('maps').select('*').select()

		if (error) {
			this.loggingService.logDatabaseError('Map', error.message)
			throw new InternalServerErrorException(`Failed to retrieve maps from database: ${error.message}`)
		}

		data.map((map) => this.localMaps.set(map.id, map))
	}

	/**
	 * Upsert multiple maps in the database if they aren't stored locally
	 * @param maps The maps to upsert
	 * @returns The upserted maps
	 */
	async upsertMany(maps: GameMap[]): Promise<GameMap[]> {
		const newMaps = maps.filter((map) => !this.localMaps.has(map.id))

		if (newMaps.length === 0) {
			return maps
		}

		const { data: _, error } = await this.supabase
			.from('maps')
			.upsert(newMaps, { onConflict: 'id', ignoreDuplicates: true })

		if (error) {
			this.loggingService.logDatabaseError('Map', error.message)
			return newMaps
		}

		maps.map((map) => this.localMaps.set(map.id, map))

		return maps
	}
}
