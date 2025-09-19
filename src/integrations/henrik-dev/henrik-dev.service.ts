import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { HenrikDevClient } from './henrik-dev.client'

@Injectable()
export class HenrikDevService {
	constructor(private readonly henrikDevClient: HenrikDevClient) {}

	/**
	 * Get recent matches from the HenrikDev API with the provided filters and transforms the data into a more usable format
	 */
	async getRecentMatches(region: string, platform: string, name: string, tag: string, mode: string, limit: number) {
		const response = await this.henrikDevClient.getRecentMatches(region, platform, name, tag, mode, limit)

		if (response.status !== 200) {
			throw new InternalServerErrorException(`Failed to call HenrikDev API with status code ${response.status}`)
		}

		const rawData = response.data.data

		if (!rawData) {
			throw new InternalServerErrorException('HenrikDev API returned an empty response')
		}

		const matches = rawData.map((match) => {
			const metadata = match.metadata
			const players = match.players || []
			const teams = match.teams || []
			const rounds = match.rounds || []
			const kills = match.kills || []

			return {
				match_id: metadata?.match_id,
				map: metadata?.map,
				duration: metadata?.game_length_in_ms,
				start_time: metadata?.started_at,
				mode: metadata?.queue,
				season: metadata?.season,
				platform: metadata?.platform,
				party_rr_penalties: metadata?.party_rr_penaltys,
				region: metadata?.region,
				cluster: metadata?.cluster,
				players: players.map((player) => {
					return {
						player_id: player.puuid,
						name: player.name,
						tag: player.tag,
						team_id: player.team_id,
						party_id: player.party_id,
						agent: player.agent,
						stats: player.stats,
						ability_casts: player.ability_casts,
						tier: player.tier,
						customization: {
							card: player.card_id,
							title: player.title_id,
							border: player.prefered_level_border
						},
						level: player.account_level,
						session_playtime: player.session_playtime_in_ms,
						behavior: player.behavior,
						economy: player.economy
					}
				}),
				teams,
				rounds: rounds.map((round) => {
					return {
						round_id: round.id,
						result: round.result,
						winning_team: round.winning_team,
						plant: round.plant,
						defuse: round.defuse,
						stats: round.stats
					}
				}),
				kills: kills.map((kill, index) => {
					return {
						kill_id: index,
						round: kill.round,
						killer: kill.killer,
						victim: kill.victim,
						weapon: kill.weapon,
						time_in_match: kill.time_in_match_in_ms,
						time_in_round: kill.time_in_round_in_ms,
						assister: kill.assistants,
						secondary_mode: kill.secondary_fire_mode,
						location: kill.location
					}
				})
			}
		})
		return matches
	}
}
