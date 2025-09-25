import { LoggingService } from '@modules/logging/logging.service'
import { BadGatewayException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { AxiosError } from 'axios'
import { HenrikDevClient } from './henrik-dev.client'
import {
	V1ValidatedStoredMatch,
	V4RecentMatchSchema,
	ValidatedV1StoredMatch,
	ValidatedV4Match,
	type Match,
	type Performance,
	type Player
} from './henrik-dev.schemas'

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
	async getRecentMatches(region: string, platform: string, name: string, tag: string, mode: string, limit: number) {
		try {
			const response = await this.henrikDevClient.getRecentMatches(region, platform, name, tag, mode, limit)
			const rawMatchData = response.data.data || []
			const validatedMatchData: ValidatedV4Match[] = rawMatchData.map((match) => {
				try {
					return V4RecentMatchSchema.parse(match)
				} catch (error) {
					this.loggingService.logValidationError(
						'HenrikDev',
						`Failed to validate data from HenrikDev with error [${error}]`
					)
					throw new BadGatewayException('Failed to validate data from HenrikDev')
				}
			})

			const maps = new Map<string, { id: string; name: string }>()
			const agents = new Map<string, { id: string; name: string }>()
			const modes = new Map<string, { id: string; name: string; mode_type: string }>()

			const players: Player[] = []
			const matches: Match[] = []
			const performances: Performance[] = []

			for (const validatedMatch of validatedMatchData) {
				const metadata = validatedMatch.metadata

				const teams = validatedMatch.teams
				let winningTeam = 'draw'

				for (const team of teams || []) {
					if (team.won) {
						winningTeam = team.team_id
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
					mode_type: metadata.queue.mode_type
				})

				matches.push({
					id: metadata.match_id,
					map_id: metadata.map.id,
					mode_id: metadata.queue.id,
					date: metadata.started_at,
					winning_team: winningTeam
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
						level: player.account_level,
						customization: player.customization,
						rank: player.tier
					})

					performances.push({
						player_id: player.puuid,
						match_id: metadata.match_id,
						team: player.team_id,
						agent_id: player.agent.id,
						score: player.stats.score,
						kills: player.stats.kills,
						deaths: player.stats.deaths,
						assists: player.stats.assists,
						damage_dealt: player.stats.damage.dealt,
						damage_taken: player.stats.damage.received,
						headshots: player.stats.headshots,
						bodyshots: player.stats.bodyshots,
						legshots: player.stats.legshots,
						ability_casts: player.ability_casts,
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

	/**
	 * Get stored matches from the HenrikDev API with the provided filters and transforms the data into a more usable format
	 * @param region The region to get matches from
	 * @param name The name of the player to get matches from
	 * @param tag The tag of the player to get matches from
	 * @param mode The mode to get matches from
	 * @param page The page of matches to get
	 * @param limit The limit of matches to get
	 * @returns Simplified match data, separated into matches, performances, maps, agents, and modes
	 */
	async getStoredMatches(region: string, name: string, tag: string, mode: string, page: number, limit: number) {
		try {
			const response = await this.henrikDevClient.getStoredMatches(region, name, tag, mode, page, limit)
			const rawStoredMatchData = response.data.data || []
			const validatedStoredMatchData: ValidatedV1StoredMatch[] = rawStoredMatchData.map((match) => {
				try {
					return V1ValidatedStoredMatch.parse(match)
				} catch (error) {
					this.loggingService.logValidationError(
						'HenrikDev',
						`Failed to validate data from HenrikDev with error [${error}]`
					)
					throw new BadGatewayException('Failed to validate data from HenrikDev')
				}
			})

			const playerId = validatedStoredMatchData[0].stats.puuid
			const maps = new Map<string, { id: string; name: string }>()
			const agents = new Map<string, { id: string; name: string }>()
			const modes = new Map<string, { name: string }>()

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
					id: metadata.map.id,
					map_id: metadata.map.id,
					mode_id: metadata.mode,
					date: metadata.started_at,
					winning_team: winningTeam
				})

				agents.set(storedMatch.stats.character.id, {
					id: storedMatch.stats.character.id,
					name: storedMatch.stats.character.name
				})

				//Scrappy fix until API swaggaer is updated
				const damage_dealt = storedMatch.stats.damage as { made: number; received: number }

				performances.push({
					player_id: storedMatch.stats.puuid,
					match_id: metadata.id,
					team: storedMatch.stats.team,
					agent_id: storedMatch.stats.character.id,
					score: storedMatch.stats.score,
					kills: storedMatch.stats.kills,
					deaths: storedMatch.stats.deaths,
					assists: storedMatch.stats.assists,
					damage_dealt: damage_dealt.made,
					damage_taken: damage_dealt.received,
					headshots: storedMatch.stats.shots.head,
					bodyshots: storedMatch.stats.shots.body,
					legshots: storedMatch.stats.shots.leg,
					ability_casts: undefined,
					rank: {
						id: storedMatch.stats.tier,
						name: 'N/A'
					},
					behavior: undefined,
					economy: undefined
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
}
