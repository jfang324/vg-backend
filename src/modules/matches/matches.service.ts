import { HenrikDevService } from '@integrations/henrik-dev/henrik-dev.service'
import { AgentRepository } from '@modules/database/supabase_repositories/agent.repository'
import { MapRepository } from '@modules/database/supabase_repositories/map.repository'
import { MatchRepository } from '@modules/database/supabase_repositories/match.repository'
import { ModeRepository } from '@modules/database/supabase_repositories/mode.repository'
import { PerformanceRepository } from '@modules/database/supabase_repositories/performance.repository'
import { PlayerRepository } from '@modules/database/supabase_repositories/player.repository'
import { LoggingService } from '@modules/logging/logging.service'
import { Injectable, InternalServerErrorException } from '@nestjs/common'

@Injectable()
export class MatchesService {
	constructor(
		private readonly henrikDevService: HenrikDevService,
		private readonly mapRepository: MapRepository,
		private readonly agentRepository: AgentRepository,
		private readonly matchRepository: MatchRepository,
		private readonly modeRepository: ModeRepository,
		private readonly playerRepository: PlayerRepository,
		private readonly performanceRepository: PerformanceRepository,
		private readonly loggingService: LoggingService
	) {}

	/**
	 * Get a match by its id
	 * @param id The id of the match to get
	 * @param region The region of the match to get
	 * @returns The found match
	 */
	async getMatch(id: string, region: string) {
		const exists = await this.matchRepository.getById(id)

		if (exists) {
			const { map_id, mode_id, ...match } = exists

			const batch_1 = await Promise.all([
				this.performanceRepository.getByMatchId(id),
				this.mapRepository.getById(map_id),
				this.modeRepository.getById(mode_id)
			])

			const performances = batch_1[0]
			const map = batch_1[1]
			const mode = batch_1[2]

			const batch_2 = await Promise.all([
				this.playerRepository.getManyByIds(performances.map((performance) => performance.player_id)),
				this.agentRepository.getManyByIds(performances.map((performance) => performance.agent_id))
			])

			const players = batch_2[0]
			const agents = batch_2[1]

			return {
				message: 'Successfully retrieved match data from cache',
				data: {
					match: {
						...match,
						map: {
							...map,
							img: `https://media.valorant-api.com/maps/${map_id}/splash.png`
						},
						mode
					},
					players: performances.map((performance) => {
						const { match_id: _, player_id, agent_id, rank: __, ...rest } = performance
						const player = players.find((player) => player.id === player_id)!
						const agent = agents.find((agent) => agent.id === agent_id)!

						return {
							player: {
								...player,
								customization: {
									...player.customization,
									card_img: `https://media.valorant-api.com/agents/${player.customization.card}/displayicon.png`
								}
							},
							stats: rest,
							agent: {
								...agent,
								img: `https://media.valorant-api.com/agents/${agent.id}/displayicon.png`
							}
						}
					})
				}
			}
		}

		const data = await this.henrikDevService.getMatchByIdAndRegion(id, region)

		if (!data) {
			throw new InternalServerErrorException(`Failed to retrieve match`)
		}

		const { match, players, performances, maps, agents, modes } = data

		const playerLookup = new Map(players.map((player) => [player.id, player]))
		const agentLookup = new Map(agents.map((agent) => [agent.id, agent]))

		const { map_id: _, mode_id: __, ...rest } = match

		const staticTablePromises = Promise.all([
			this.mapRepository.upsertMany(maps),
			this.agentRepository.upsertMany(agents),
			this.modeRepository.upsertMany(modes)
		])

		const dynamicTablePromises = Promise.all([
			this.matchRepository.upsertMany([
				{
					...match,
					date: new Date(match.date)
				}
			]),
			this.playerRepository.upsertMany(players)
		])

		//staticTablePromises must be completed first because dynamicTablePromises insert entities that reference the entities from staticTablePromises
		staticTablePromises
			.then(() => dynamicTablePromises.then(() => this.performanceRepository.upsertMany(performances)))
			.catch((error: Error) => this.loggingService.logDatabaseError('Performance', 'upsertMany', error.message))

		return {
			message: 'Successfully retrieved match',
			data: {
				match: {
					...rest,
					map: {
						...maps.find((map) => map.id === match.map_id),
						img: `https://media.valorant-api.com/maps/${match.map_id}/splash.png`
					},
					mode: modes.find((mode) => mode.id === match.mode_id)
				},
				players: performances.map((performance) => {
					const { match_id: _, player_id, agent_id, rank: __, ...rest } = performance
					const player = playerLookup.get(player_id)!
					const agent = agentLookup.get(agent_id)!

					return {
						player: {
							...player,
							customization: {
								...player.customization,
								card_img: `https://media.valorant-api.com/agents/${player.customization.card}/displayicon.png`
							}
						},
						stats: rest,
						agent: {
							...agent,
							img: `https://media.valorant-api.com/agents/${agentLookup.get(agent_id)!.id}/displayicon.png`
						}
					}
				})
			}
		}
	}
}
