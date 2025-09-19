import { HenrikDevService } from '@integrations/henrik-dev/henrik-dev.service'
import { Injectable } from '@nestjs/common'

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

		return {
			region,
			platform,
			name,
			tag,
			mode,
			limit,
			data
		}
	}
}
