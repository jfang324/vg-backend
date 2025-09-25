import { Mode } from '@common/types/mode.type'
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
export class PlayersService {
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
	 * Get recent matches from the HenrikDev API and transforms the data into a more usable format
	 * @param region The region to get matches from
	 * @param platform The platform to get matches from
	 * @param name The name of the player to get matches from
	 * @param tag The tag of the player to get matches from
	 * @param mode The mode to get matches from
	 * @param limit The limit of matches to get
	 * @returns The simplified data from the HenrikDev API
	 */
	async getRecentMatches(region: string, platform: string, name: string, tag: string, mode: string, limit: number) {
		const data = await this.henrikDevService.getRecentMatches(region, platform, name, tag, mode, limit)

		if (!data) {
			throw new InternalServerErrorException(`Failed to retrieve recent matches`)
		}

		const { matches, players, performances, maps, agents, modes } = data

		const agentLookup = new Map(agents.map((agent) => [agent.id, agent]))
		const mapLookup = new Map(maps.map((map) => [map.id, map]))
		const modeLookup = new Map(modes.map((mode) => [mode.id, mode]))

		const currentPlayer = players.find((player) => {
			return player.name === name && player.tag === tag
		})!

		const staticTablePromises = Promise.all([
			this.mapRepository.upsertMany(maps),
			this.agentRepository.upsertMany(agents),
			this.modeRepository.upsertMany(modes)
		])

		const dynamicTablePromises = Promise.all([
			this.matchRepository.upsertMany(matches.map((match) => ({ ...match, date: new Date(match.date) }))),
			this.playerRepository.upsertMany(players)
		])

		//staticTablePromises must be completed first because dynamicTablePromises insert entities that reference the entities from staticTablePromises
		staticTablePromises
			.then(() => dynamicTablePromises.then(() => this.performanceRepository.upsertMany(performances)))
			.catch((error: Error) =>
				this.loggingService.logDatabaseError('Unknown', `Failed to cached data: ${error.message}`)
			)

		return {
			message: 'Successfully retrieved recent matches',
			data: {
				player: {
					...currentPlayer,
					rank: {
						...currentPlayer.rank,
						img: `https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/${currentPlayer.rank.id}/smallicon.png`
					},
					customization: {
						...currentPlayer.customization,
						card_img: `https://media.valorant-api.com/playercards/${currentPlayer.customization.card}/wideart.png`
					}
				},
				matches: matches
					.map((match, index) => {
						const { map_id, mode_id, ...rest } = match
						const map = mapLookup.get(map_id)
						const mode = modeLookup.get(mode_id)

						if (!map || !mode) {
							return null
						}

						const relevantPerformances = performances.filter(
							(performance) => performance.player_id === currentPlayer.id
						)

						const { agent_id, ...performance } = relevantPerformances[index]
						const stats = {
							...performance,
							agent: {
								...agentLookup.get(agent_id)!,
								img: `https://media.valorant-api.com/agents/${agentLookup.get(agent_id)!.id}/displayicon.png`
							}
						}

						return {
							...rest,
							map: {
								...map,
								img: `https://media.valorant-api.com/maps/${map.id}/splash.png`
							},
							mode,
							stats
						}
					})
					.filter((x) => x !== null)
			}
		}
	}

	/**
	 * Get stored matches from the HenrikDev API and transforms the data into a more usable format
	 * @param region The region to get matches from
	 * @param name The name of the player to get matches from
	 * @param tag The tag of the player to get matches from
	 * @param mode The mode to get matches from
	 * @param page The page of matches to get
	 * @param limit The limit of matches to get
	 * @returns The simplified data from the HenrikDev API
	 */
	async getStoredMatches(region: string, name: string, tag: string, mode: string, page: number, limit: number) {
		const data = await this.henrikDevService.getStoredMatches(region, name, tag, mode, page, limit)

		if (!data) {
			throw new InternalServerErrorException(`Failed to retrieve stored matches`)
		}

		const { playerId, matches, performances, maps, agents, modes } = data

		const agentLookup = new Map(agents.map((agent) => [agent.id, agent]))
		const mapLookup = new Map(maps.map((map) => [map.id, map]))
		const modeLookup = new Map<string, Mode>()

		const fullModes = await Promise.all(modes.map((mode) => this.modeRepository.getByName(mode.name)))
		fullModes.map((mode) => modeLookup.set(mode.name, mode))

		const player = await this.playerRepository.getById(playerId)

		return {
			message: 'Successfully retrieved stored matches',
			data: {
				player: {
					...player,
					rank: {
						...player.rank,
						img: `https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/${player.rank.id}/smallicon.png`
					},
					customization: {
						...player.customization,
						card_img: `https://media.valorant-api.com/playercards/${player.customization.card}/wideart.png`
					}
				},
				matches: matches
					.map((match, index) => {
						const { map_id, mode_id, ...rest } = match
						const map = mapLookup.get(map_id)
						const mode = modeLookup.get(mode_id)

						if (!map || !mode) {
							return null
						}

						const { agent_id, ...performance } = performances[index]
						const stats = {
							...performance,
							agent: {
								...agentLookup.get(agent_id)!,
								img: `https://media.valorant-api.com/agents/${agentLookup.get(agent_id)!.id}/displayicon.png`
							}
						}

						return {
							...rest,
							map: {
								...map,
								img: `https://media.valorant-api.com/maps/${map.id}/splash.png`
							},
							mode,
							stats
						}
					})
					.filter((x) => x !== null)
			}
		}
	}
}
