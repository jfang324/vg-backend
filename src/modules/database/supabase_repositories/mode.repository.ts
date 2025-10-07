import { Mode } from '@common/types/mode.type'
import { Database } from '@generated/supabase/database.types'
import { LoggingService } from '@modules/logging/logging.service'
import { Inject, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common'
import { SupabaseClient } from '@supabase/supabase-js'
import { ModeRepositoryInterface } from '../interfaces/mode.repository.interface'
import { Mode as DB_Mode } from '../types/mode.db.type'

@Injectable()
export class ModeRepository implements ModeRepositoryInterface, OnModuleInit {
	private localModes: Map<string, Mode> = new Map()

	constructor(
		@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient<Database>,
		private readonly loggingService: LoggingService
	) {}

	/**
	 * Transform a database mode into a domain mode
	 * @param dbMode The database mode to transform
	 * @returns The transformed mode
	 */
	mapDbToDomain(dbMode: DB_Mode): Mode {
		return {
			id: dbMode.id,
			name: dbMode.name,
			modeType: dbMode.mode_type
		}
	}

	/**
	 * Transform a domain mode into a database mode
	 * @param mode The domain mode to transform
	 * @returns The transformed mode
	 */
	mapDomainToDb(mode: Mode): DB_Mode {
		return {
			id: mode.id,
			name: mode.name,
			mode_type: mode.modeType
		}
	}

	/**
	 * On module init, retrieve all modes from the database and store them locally
	 */
	async onModuleInit() {
		const { data, error } = await this.supabase.from('modes').select('*').select()

		if (error) {
			this.loggingService.logDatabaseError('Mode', 'onModuleInit', error.message)
			throw new InternalServerErrorException(`Failed to retrieve modes from database: ${error.message}`)
		}

		const dbModes = data
		const modes = dbModes.map((mode) => this.mapDbToDomain(mode))

		for (const mode of modes) {
			this.localModes.set(mode.id, mode)
		}
	}

	/**
	 * Upsert multiple modes in the database if they aren't stored locally
	 * @param modes The modes to upsert
	 * @returns The upserted modes
	 */
	async upsertMany(modes: Mode[]): Promise<Mode[]> {
		const newModes = modes.filter((mode) => !this.localModes.has(mode.id))

		if (newModes.length === 0) {
			return modes
		}

		const dbModes = newModes.map((mode) => this.mapDomainToDb(mode))

		const { data: _, error } = await this.supabase
			.from('modes')
			.upsert(dbModes, { onConflict: 'id', ignoreDuplicates: true })

		if (error) {
			this.loggingService.logDatabaseError('Mode', 'upsertMany', error.message)
			return newModes
		}

		modes.map((mode) => this.localModes.set(mode.id, mode))

		return modes
	}

	/**
	 * Get a mode by its name
	 * @param name The name of the mode to get
	 * @returns The mode with the given name
	 */
	async getByName(name: string): Promise<Mode | null> {
		for (const mode of this.localModes.values()) {
			if (mode.name === name) {
				return mode
			}
		}

		const { data, error } = await this.supabase.from('modes').select('*').eq('name', name).single()

		if (error) {
			this.loggingService.logDatabaseError('Mode', 'getByName', error.message)
			return null
		}

		const mode = this.mapDbToDomain(data)

		this.localModes.set(mode.id, mode)

		return mode
	}

	/**
	 * Find a mode by its id
	 * @param id The id of the mode to find
	 * @returns The found mode
	 */
	async getById(id: string): Promise<Mode | null> {
		const cachedMode = this.localModes.get(id)

		if (cachedMode) {
			return cachedMode
		}

		const { data, error } = await this.supabase.from('modes').select('*').eq('id', id).single()

		if (error) {
			this.loggingService.logDatabaseError('Mode', 'getById', error.message)
			return null
		}

		const mode = this.mapDbToDomain(data)

		this.localModes.set(mode.id, mode)

		return mode
	}
}
