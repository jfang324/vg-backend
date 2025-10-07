import type { Match } from '@common/types/match.type'
import type { Performance } from '@common/types/performance.type'
import type { Player } from '@common/types/player.type'
import { LoggingService } from '@modules/logging/logging.service'
import { BadGatewayException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { AxiosError } from 'axios'
import camelcaseKeys from 'camelcase-keys'
import { HenrikDevClient } from './henrik-dev.client'
import { V1StoredMatchSchema, V4MatchSchema, ValidatedV1StoredMatch, ValidatedV4Match } from './henrik-dev.schemas'
import type { Agent } from './schemas/agent.schema'
import type { Map as GameMap } from './schemas/map.schema'
import type { Mode } from './schemas/mode.schema'

@Injectable()
export class HenrikDevService {
	constructor(
		private readonly henrikDevClient: HenrikDevClient,
		private readonly loggingService: LoggingService
	) {}

	/**
	 * Get recent matches from the HenrikDev API with the provided filters and transforms the data into a more usable format
	 * @param region The region to get matches from
	 * @param platform The platform to get matches from
	 * @param name The name of the player to get matches from
	 * @param tag The tag of the player to get matches from
	 * @param mode The mode to get matches from
	 * @param limit The limit of matches to get
	 * @returns Simplified match data, separated into matches, performances, maps, agents, and modes
	 */
	// eslint-disable-next-line complexity -- Data from HenrikDev is complex and transformation should be centralized
	async getRecentMatches(region: string, platform: string, name: string, tag: string, mode: string, limit: number) {
		try {
			const response = await this.henrikDevClient.getRecentMatches(region, platform, name, tag, mode, limit)
			const data = response.data.data

			if (!data) throw new BadGatewayException('No data returned')

			const validatedMatchData: ValidatedV4Match[] = data.map((match) => {
				try {
					const camelCaseMatch = camelcaseKeys(match, { deep: true })

					return V4MatchSchema.parse(camelCaseMatch)
				} catch (error) {
					this.loggingService.logValidationError(
						'HenrikDev',
						`Failed to validate data from HenrikDev with error [${error}]`
					)
					throw new BadGatewayException('Failed to validate data from HenrikDev')
				}
			})

			const maps = new Map<string, GameMap>()
			const agents = new Map<string, Agent>()
			const modes = new Map<string, Mode>()

			const players: Player[] = []
			const matches: Match[] = []
			const performances: Performance[] = []

			for (const validatedMatch of validatedMatchData) {
				const metadata = validatedMatch.metadata

				const teams = validatedMatch.teams
				let winningTeam = 'draw'

				for (const team of teams || []) {
					if (team.won) {
						winningTeam = team.teamId
						break
					}
				}

				maps.set(metadata.map.id, {
					id: metadata.map.id,
					name: metadata.map.name
				})

				modes.set(metadata.queue.id, {
					id: metadata.queue.id,
					name: metadata.queue.name,
					modeType: metadata.queue.modeType
				})

				matches.push({
					id: metadata.matchId,
					mapId: metadata.map.id,
					modeId: metadata.queue.id,
					date: new Date(metadata.startedAt),
					winningTeam: winningTeam
				})

				for (const player of validatedMatch.players || []) {
					agents.set(player.agent.id, {
						id: player.agent.id,
						name: player.agent.name
					})

					players.push({
						id: player.puuid,
						name: player.name,
						tag: player.tag,
						region: metadata.region,
						level: player.accountLevel,
						customization: player.customization,
						rank: player.tier
					})

					performances.push({
						playerId: player.puuid,
						matchId: metadata.matchId,
						team: player.teamId,
						agentId: player.agent.id,
						score: player.stats.score,
						kills: player.stats.kills,
						deaths: player.stats.deaths,
						assists: player.stats.assists,
						damageDealt: player.stats.damage.dealt,
						damageTaken: player.stats.damage.received,
						headshots: player.stats.headshots,
						bodyshots: player.stats.bodyshots,
						legshots: player.stats.legshots,
						abilityCasts: player.abilityCasts,
						rank: player.tier,
						behavior: player.behavior,
						economy: player.economy
					})
				}
			}

			return {
				matches,
				players,
				performances,
				maps: Array.from(maps.values()),
				agents: Array.from(agents.values()),
				modes: Array.from(modes.values())
			}
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				this.loggingService.logApiError('HenrikDev', error)

				const status = error.response?.status

				if (status === 404) {
					throw new NotFoundException('User not found')
				}

				throw new InternalServerErrorException(`External service error`)
			}

			throw new InternalServerErrorException(`Something unexpected happened`)
		}
	}

	// /**
	//  * Get stored matches from the HenrikDev API with the provided filters and transforms the data into a more usable format
	//  * @param region The region to get matches from
	//  * @param name The name of the player to get matches from
	//  * @param tag The tag of the player to get matches from
	//  * @param mode The mode to get matches from
	//  * @param page The page of matches to get
	//  * @param limit The limit of matches to get
	//  * @returns Simplified match data, separated into matches, performances, maps, agents, and modes
	//  */
	async getStoredMatches(region: string, name: string, tag: string, mode: string, page: number, limit: number) {
		try {
			const response = await this.henrikDevClient.getStoredMatches(region, name, tag, mode, page, limit)
			const data = response.data.data

			if (!data) throw new BadGatewayException('No data returned')

			const validatedStoredMatchData: ValidatedV1StoredMatch[] = data.map((match) => {
				try {
					const camelCaseMatch = camelcaseKeys(match, { deep: true })

					return V1StoredMatchSchema.parse(camelCaseMatch)
				} catch (error) {
					this.loggingService.logValidationError(
						'HenrikDev',
						`Failed to validate data from HenrikDev with error [${error}]`
					)
					throw new BadGatewayException('Failed to validate data from HenrikDev')
				}
			})

			const playerId = validatedStoredMatchData[0].stats.puuid
			const maps = new Map<string, GameMap>()
			const agents = new Map<string, Agent>()
			const modes = new Map<string, Partial<Mode>>()

			const matches: Match[] = []
			const performances: Performance[] = []

			for (const storedMatch of validatedStoredMatchData) {
				const metadata = storedMatch.meta
				const winningTeam = storedMatch.teams.red > storedMatch.teams.blue ? 'Red' : 'Blue'

				maps.set(metadata.map.id, {
					id: metadata.map.id,
					name: metadata.map.name
				})

				modes.set(metadata.mode, {
					name: metadata.mode
				})

				matches.push({
					id: metadata.id,
					mapId: metadata.map.id,
					modeId: metadata.mode,
					date: new Date(metadata.startedAt),
					winningTeam: winningTeam
				})

				agents.set(storedMatch.stats.character.id, {
					id: storedMatch.stats.character.id,
					name: storedMatch.stats.character.name
				})

				//Scrappy fix until API swaggaer is updated
				const damage_dealt = storedMatch.stats.damage

				performances.push({
					playerId: storedMatch.stats.puuid,
					matchId: metadata.id,
					team: storedMatch.stats.team,
					agentId: storedMatch.stats.character.id,
					score: storedMatch.stats.score,
					kills: storedMatch.stats.kills,
					deaths: storedMatch.stats.deaths,
					assists: storedMatch.stats.assists,
					damageDealt: damage_dealt.made,
					damageTaken: damage_dealt.received,
					headshots: storedMatch.stats.shots.head,
					bodyshots: storedMatch.stats.shots.body,
					legshots: storedMatch.stats.shots.leg,
					rank: {
						id: storedMatch.stats.tier,
						name: 'N/A'
					}
				})
			}

			return {
				playerId,
				matches,
				performances,
				maps: Array.from(maps.values()),
				agents: Array.from(agents.values()),
				modes: Array.from(modes.values())
			}
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				this.loggingService.logApiError('HenrikDev', error)

				const status = error.response?.status

				if (status === 404) {
					throw new NotFoundException('User not found')
				}

				throw new InternalServerErrorException(`External service error`)
			}

			throw new InternalServerErrorException(`Something unexpected happened`)
		}
	}

	// /**
	//  * Get a match by its id and region
	//  * @param id The id of the match
	//  * @param region The region of the match
	//  * @returns The simplified data from the HenrikDev API
	//  **/
	async getMatchByIdAndRegion(id: string, region: string) {
		try {
			const response = await this.henrikDevClient.getMatchByIdAndRegion(id, region)
			const data = response.data.data

			if (!data) throw new BadGatewayException('No data returned')

			const validatedMatchData: ValidatedV4Match = V4MatchSchema.parse(camelcaseKeys(data, { deep: true }))

			const maps = new Map<string, GameMap>()
			const agents = new Map<string, Agent>()
			const modes = new Map<string, Mode>()

			const players: Player[] = []
			const performances: Performance[] = []

			const metadata = validatedMatchData.metadata
			const teams = validatedMatchData.teams

			let winningTeam = 'draw'

			for (const team of teams || []) {
				if (team.won) {
					winningTeam = team.teamId
					break
				}
			}

			const match = {
				id: metadata.matchId,
				mapId: metadata.map.id,
				modeId: metadata.queue.id,
				date: new Date(metadata.startedAt),
				winningTeam: winningTeam
			}

			maps.set(metadata.map.id, {
				id: metadata.map.id,
				name: metadata.map.name
			})

			modes.set(metadata.queue.id, {
				id: metadata.queue.id,
				name: metadata.queue.name,
				modeType: metadata.queue.modeType
			})

			for (const player of validatedMatchData.players) {
				agents.set(player.agent.id, {
					id: player.agent.id,
					name: player.agent.name
				})

				players.push({
					id: player.puuid,
					name: player.name,
					tag: player.tag,
					region: metadata.region,
					level: player.accountLevel,
					customization: player.customization,
					rank: player.tier
				})

				performances.push({
					playerId: player.puuid,
					matchId: metadata.matchId,
					team: player.teamId,
					agentId: player.agent.id,
					score: player.stats.score,
					kills: player.stats.kills,
					deaths: player.stats.deaths,
					assists: player.stats.assists,
					damageDealt: player.stats.damage.dealt,
					damageTaken: player.stats.damage.received,
					headshots: player.stats.headshots,
					bodyshots: player.stats.bodyshots,
					legshots: player.stats.legshots,
					abilityCasts: player.abilityCasts,
					rank: player.tier,
					behavior: player.behavior,
					economy: player.economy
				})
			}

			return {
				match,
				players,
				performances,
				maps: Array.from(maps.values()),
				agents: Array.from(agents.values()),
				modes: Array.from(modes.values())
			}
		} catch (error) {
			if (error instanceof AxiosError) {
				this.loggingService.logApiError('HenrikDev', error)

				const status = error.response?.status

				if (status === 404) {
					throw new NotFoundException('User not found')
				}

				throw new InternalServerErrorException(`External service error`)
			}
			throw new InternalServerErrorException(`Something unexpected happened`)
		}
	}
}
