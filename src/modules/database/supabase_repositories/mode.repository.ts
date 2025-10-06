import { Mode } from '@common/types/mode.type'
import { Database } from '@generated/supabase/database.types'
import { LoggingService } from '@modules/logging/logging.service'
import { Inject, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common'
import { SupabaseClient } from '@supabase/supabase-js'
import { ModeRepositoryInterface } from '../interfaces/mode.repository.interface'

@Injectable()
export class ModeRepository implements ModeRepositoryInterface, OnModuleInit {
	private localModes: Map<string, Mode> = new Map()

	constructor(
		@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient<Database>,
		private readonly loggingService: LoggingService
	) {}

	/**
	 * On module init, retrieve all modes from the database and store them locally
	 */
	async onModuleInit() {
		const { data, error } = await this.supabase.from('modes').select('*').select()

		if (error) {
			this.loggingService.logDatabaseError('Mode', 'onModuleInit', error.message)
			throw new InternalServerErrorException(`Failed to retrieve modes from database: ${error.message}`)
		}

		data.map((mode) => this.localModes.set(mode.id, mode))
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

		const { data: _, error } = await this.supabase
			.from('modes')
			.upsert(newModes, { onConflict: 'id', ignoreDuplicates: true })

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
	async getByName(name: string): Promise<Mode> {
		for (const mode of this.localModes.values()) {
			if (mode.name === name) {
				return mode
			}
		}

		const { data: mode, error } = await this.supabase.from('modes').select('*').eq('name', name).single()

		if (error) {
			this.loggingService.logDatabaseError('Mode', 'getByName', error.message)
			throw new InternalServerErrorException(`Failed to retrieve mode from database: ${error.message}`)
		}

		this.localModes.set(mode.id, mode)

		return mode
	}

	/**
	 * Find a mode by its id
	 * @param id The id of the mode to find
	 * @returns The found mode
	 */
	async getById(id: string): Promise<Mode | null> {
		const mode = this.localModes.get(id)

		if (mode) {
			return mode
		}

		const { data, error } = await this.supabase.from('modes').select('*').eq('id', id).single()

		if (error) {
			this.loggingService.logDatabaseError('Mode', 'getById', error.message)
			return null
		}

		this.localModes.set(data.id, data)

		return data
	}
}
