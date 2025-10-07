import { Map as GameMap } from '@common/types/map.type'
import { Database } from '@generated/supabase/database.types'
import { LoggingService } from '@modules/logging/logging.service'
import { Inject, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common'
import { SupabaseClient } from '@supabase/supabase-js'
import { MapRepositoryInterface } from '../interfaces/map.repository.interface'
import { Map as DB_Map } from '../types/map.db.type'

@Injectable()
export class MapRepository implements MapRepositoryInterface, OnModuleInit {
	private localMaps: Map<string, GameMap> = new Map()

	constructor(
		@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient<Database>,
		private readonly loggingService: LoggingService
	) {}

	/**
	 * Transform a database map into a domain map
	 * @param dbMap The database map to transform
	 * @returns The transformed map
	 */
	mapDbToDomain(dbMap: DB_Map): GameMap {
		return {
			id: dbMap.id,
			name: dbMap.name
		}
	}

	/**
	 * Transform a domain map into a database map
	 * @param map The domain map to transform
	 * @returns The transformed map
	 */
	mapDomainToDb(map: GameMap): DB_Map {
		return {
			id: map.id,
			name: map.name
		}
	}

	/**
	 * On module init, retrieve all maps from the database and store them locally
	 */
	async onModuleInit() {
		const { data, error } = await this.supabase.from('maps').select('*').select()

		if (error) {
			this.loggingService.logDatabaseError('Map', 'onModuleInit', error.message)
			throw new InternalServerErrorException(`Failed to retrieve maps from database: ${error.message}`)
		}

		const dbMaps = data
		const maps = dbMaps.map((map) => this.mapDbToDomain(map))

		for (const map of maps) {
			this.localMaps.set(map.id, map)
		}
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

		const dbMaps = newMaps.map((map) => this.mapDomainToDb(map))

		const { data: _, error } = await this.supabase
			.from('maps')
			.upsert(dbMaps, { onConflict: 'id', ignoreDuplicates: true })

		if (error) {
			this.loggingService.logDatabaseError('Map', 'upsertMany', error.message)
			return newMaps
		}

		maps.map((map) => this.localMaps.set(map.id, map))

		return maps
	}

	/**
	 * Find a map by its id
	 * @param id The id of the map to find
	 * @returns The found map
	 */
	async getById(id: string): Promise<GameMap | null> {
		const cachedMap = this.localMaps.get(id)

		if (cachedMap) {
			return cachedMap
		}

		const { data, error } = await this.supabase.from('maps').select('*').eq('id', id).single()

		if (error) {
			this.loggingService.logDatabaseError('Map', 'getById', error.message)
			return null
		}

		const map = this.mapDbToDomain(data)

		this.localMaps.set(map.id, map)

		return map
	}
}
