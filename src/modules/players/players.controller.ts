import { ModeValidationPipe } from '@common/pipes/mode-validation.pipe'
import { PlatformValidationPipe } from '@common/pipes/platform-validation.pipe'
import { RegionValidationPipe } from '@common/pipes/region-validation.pipe'
import { Controller, Get, Param, Query } from '@nestjs/common'
import { LimitValidationPipe } from './pipes/limit-validation.pipe'
import { NameTagValidationPipe, type NameTag } from './pipes/nametag-validation.pipe'
import { PlayersService } from './players.service'

@Controller({
	path: 'players',
	version: '1'
})
export class PlayersController {
	constructor(private readonly playersService: PlayersService) {}

	@Get(':nameTag/matches')
	async getRecentMatches(
		@Param('nameTag', NameTagValidationPipe) nameTag: NameTag,
		@Query('region', RegionValidationPipe) region: string,
		@Query('platform', PlatformValidationPipe) platform: string,
		@Query('mode', ModeValidationPipe) mode: string,
		@Query('limit', LimitValidationPipe) limit: number
	) {
		const response = await this.playersService.getRecentMatches(
			region,
			platform,
			nameTag.name,
			nameTag.tag,
			mode,
			limit
		)

		return response
	}
}
