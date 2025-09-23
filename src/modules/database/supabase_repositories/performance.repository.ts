import { Performance } from '@common/types/performance.type'
import { Database } from '@generated/supabase/database.types'
import { LoggingService } from '@modules/logging/logging.service'
import { Inject, Injectable } from '@nestjs/common'
import { SupabaseClient } from '@supabase/supabase-js'
import { PerformanceRepositoryInterface } from '../interfaces/performance.repository.interface'

@Injectable()
export class PerformanceRepository implements PerformanceRepositoryInterface {
	constructor(
		@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient<Database>,
		private readonly loggingService: LoggingService
	) {}

	/**
	 * Upsert multiple performances in the database
	 * @param performances The performances to upsert
	 * @returns The upserted performances
	 */
	async upsertMany(performances: Performance[]): Promise<Performance[]> {
		const { data: _, error } = await this.supabase
			.from('performances')
			.upsert(performances, { onConflict: 'player_id, match_id', ignoreDuplicates: true })

		if (error) {
			this.loggingService.logDatabaseError('Performance', error.message)
		}

		return performances
	}
}
