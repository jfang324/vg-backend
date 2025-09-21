import { HenrikDevService } from '@integrations/henrik-dev/henrik-dev.service'
import { Injectable, InternalServerErrorException } from '@nestjs/common'

@Injectable()
export class PlayersService {
	constructor(private readonly henrikDevService: HenrikDevService) {}

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

		const playerLookup = new Map(players.map((player) => [player.id, player]))
		const agentLookup = new Map(agents.map((agent) => [agent.id, agent]))
		const mapLookup = new Map(maps.map((map) => [map.id, map]))
		const modeLookup = new Map(modes.map((mode) => [mode.id, mode]))

		const currentPlayerId = players.find((player) => {
			return player.name === name && player.tag === tag
		})!.id

		return {
			message: 'Successfully retrieved recent matches',
			data: matches
				.map((match) => {
					const map = mapLookup.get(match.map)
					const mode = modeLookup.get(match.mode)

					if (!map || !mode) {
						return null
					}

					return {
						...match,
						map,
						mode,
						players: performances
							.filter((performance) => performance.player_id === currentPlayerId)
							.map((performance) => {
								const { player_id, match_id: _, ...performance_data } = performance

								return {
									...performance_data,
									player: playerLookup.get(player_id),
									agent: agentLookup.get(performance.agent)
								}
							})
					}
				})
				.filter((x) => x !== null)
		}
	}
}
