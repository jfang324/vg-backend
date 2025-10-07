import { Performance } from '@common/types/performance.type'
import { Database } from '@generated/supabase/database.types'
import { LoggingService } from '@modules/logging/logging.service'
import { Inject, Injectable } from '@nestjs/common'
import { SupabaseClient } from '@supabase/supabase-js'
import { PerformanceRepositoryInterface } from '../interfaces/performance.repository.interface'
import { Performance as DB_Performance } from '../types/performance.db.types'

@Injectable()
export class PerformanceRepository implements PerformanceRepositoryInterface {
	constructor(
		@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient<Database>,
		private readonly loggingService: LoggingService
	) {}

	/**
	 * Transform a database performance into a domain performance
	 * @param dbPerformance The database performance to transform
	 * @returns The transformed performance
	 */
	mapDbToDomain(dbPerformance: DB_Performance): Performance {
		const behavior = dbPerformance.behavior
			? {
					afkRounds: dbPerformance.behavior.afk_rounds,
					friendlyFire: {
						incoming: dbPerformance.behavior.friendly_fire.incoming,
						outgoing: dbPerformance.behavior.friendly_fire.outgoing
					},
					roundsInSpawn: dbPerformance.behavior.rounds_in_spawn
				}
			: undefined

		const economy = dbPerformance.economy
			? {
					spent: {
						overall: dbPerformance.economy.spent.overall,
						average: dbPerformance.economy.spent.average
					},
					loadoutValue: {
						overall: dbPerformance.economy.loadout_value.overall,
						average: dbPerformance.economy.loadout_value.average
					}
				}
			: undefined

		return {
			playerId: dbPerformance.player_id,
			matchId: dbPerformance.match_id,
			team: dbPerformance.team,
			agentId: dbPerformance.agent_id,
			score: dbPerformance.score,
			kills: dbPerformance.kills,
			deaths: dbPerformance.deaths,
			assists: dbPerformance.assists,
			damageDealt: dbPerformance.damage_dealt,
			damageTaken: dbPerformance.damage_taken,
			headshots: dbPerformance.headshots,
			bodyshots: dbPerformance.bodyshots,
			legshots: dbPerformance.legshots,
			rank: dbPerformance.rank as { id: number; name: string },
			abilityCasts: dbPerformance.ability_casts,
			behavior,
			economy
		}
	}

	/**
	 * Transform a domain performance into a database performance
	 * @param performance The domain performance to transform
	 * @returns The transformed performance
	 */
	mapDomainToDb(performance: Performance): DB_Performance {
		const behavior = performance.behavior
			? {
					afk_rounds: performance.behavior.afkRounds,
					friendly_fire: {
						incoming: performance.behavior.friendlyFire.incoming,
						outgoing: performance.behavior.friendlyFire.outgoing
					},
					rounds_in_spawn: performance.behavior.roundsInSpawn
				}
			: undefined

		const economy = performance.economy
			? {
					spent: {
						overall: performance.economy.spent.overall,
						average: performance.economy.spent.average
					},
					loadout_value: {
						overall: performance.economy.loadoutValue.overall,
						average: performance.economy.loadoutValue.average
					}
				}
			: undefined

		return {
			player_id: performance.playerId,
			match_id: performance.matchId,
			team: performance.team,
			agent_id: performance.agentId,
			score: performance.score,
			kills: performance.kills,
			deaths: performance.deaths,
			assists: performance.assists,
			damage_dealt: performance.damageDealt,
			damage_taken: performance.damageTaken,
			headshots: performance.headshots,
			bodyshots: performance.bodyshots,
			legshots: performance.legshots,
			rank: {
				id: performance.rank.id,
				name: performance.rank.name
			},
			ability_casts: performance.abilityCasts,
			behavior,
			economy
		}
	}

	/**
	 * Upsert multiple performances in the database
	 * @param performances The performances to upsert
	 * @returns The upserted performances
	 */
	async upsertMany(performances: Performance[]): Promise<Performance[]> {
		const dbPerformances = performances.map((performance) => this.mapDomainToDb(performance))

		const { data: _, error } = await this.supabase
			.from('performances')
			.upsert(dbPerformances, { onConflict: 'player_id, match_id', ignoreDuplicates: true })

		if (error) {
			this.loggingService.logDatabaseError('Performance', 'upsertMany', error.message)
		}

		return performances
	}

	/**
	 * Find performances by match id
	 * @param matchId The match id to find performances by
	 * @returns The found performances
	 */
	async getByMatchId(matchId: string): Promise<Performance[]> {
		const { data, error } = await this.supabase.from('performances').select('*').eq('match_id', matchId)

		if (error) {
			this.loggingService.logDatabaseError('Performance', 'getByMatchId', error.message)
			return []
		}

		const performances = data.map((performance) =>
			this.mapDbToDomain({
				...performance,
				rank: performance.rank as { id: number; name: string },
				ability_casts: performance.ability_casts as {
					grenade: number
					ability1: number
					ability2: number
					ultimate: number
				},
				behavior: performance.behavior as {
					afk_rounds: number
					friendly_fire: { incoming: number; outgoing: number }
					rounds_in_spawn: number
				},
				economy: performance.economy as {
					spent: { overall: number; average: number }
					loadout_value: { overall: number; average: number }
				}
			})
		)

		return performances
	}
}
