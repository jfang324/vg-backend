import { MAX_LIMIT, MIN_LIMIT } from '@common/constants/limits'
import { VALID_MODES } from '@common/constants/modes'
import { VALID_PLATFORMS } from '@common/constants/platforms'
import { VALID_REGIONS } from '@common/constants/regions'
import { ModeValidationPipe } from '@common/pipes/mode-validation.pipe'
import { PageValidationPipe } from '@common/pipes/page-validation.pipe'
import { PlatformValidationPipe } from '@common/pipes/platform-validation.pipe'
import { RegionValidationPipe } from '@common/pipes/region-validation.pipe'
import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { GetRecentMatchesDto, GetStoredMatchesDto } from './dtos/recent-matches.dto'
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
	@ApiOperation({ summary: 'Get recent matches for a player' })
	@ApiParam({
		name: 'nameTag',
		required: true,
		type: 'string',
		description: 'Must be a valid Valorant name with # separating the name and the tag',
		example: 'Hexennacht#NA1'
	})
	@ApiQuery({ name: 'region', required: false, enum: VALID_REGIONS, enumName: 'ValidRegions', type: 'string' })
	@ApiQuery({ name: 'platform', required: false, enum: VALID_PLATFORMS, enumName: 'ValidPlatforms', type: 'string' })
	@ApiQuery({ name: 'mode', required: false, enum: VALID_MODES, enumName: 'ValidModes', type: 'string' })
	@ApiQuery({ name: 'limit', required: false, type: 'number', minimum: MIN_LIMIT, maximum: MAX_LIMIT })
	@ApiResponse({ status: 200, description: 'A list of recent matches', type: GetRecentMatchesDto })
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

	@Get(':nameTag/profile')
	@ApiOperation({ summary: 'Get stored matches for a player' })
	@ApiParam({
		name: 'nameTag',
		required: true,
		type: 'string',
		description: 'Must be a valid Valorant name with # separating the name and the tag',
		example: 'Hexennacht#NA1'
	})
	@ApiQuery({ name: 'region', required: false, enum: VALID_REGIONS, enumName: 'ValidRegions', type: 'string' })
	@ApiQuery({ name: 'mode', required: false, enum: VALID_MODES, enumName: 'ValidModes', type: 'string' })
	@ApiQuery({ name: 'page', required: false, type: 'number', minimum: 1 })
	@ApiQuery({ name: 'limit', required: false, type: 'number', minimum: MIN_LIMIT, maximum: MAX_LIMIT })
	@ApiResponse({ status: 200, description: 'A list of stored matches', type: GetStoredMatchesDto })
	async getStoredMatches(
		@Param('nameTag', NameTagValidationPipe) nameTag: NameTag,
		@Query('region', RegionValidationPipe) region: string,
		@Query('mode', ModeValidationPipe) mode: string,
		@Query('page', PageValidationPipe) page: number,
		@Query('limit', LimitValidationPipe) limit: number
	) {
		const response = await this.playersService.getStoredMatches(
			region,
			nameTag.name,
			nameTag.tag,
			mode,
			page,
			limit
		)

		return response
	}

	@Get(':nameTag/assets')
	@ApiOperation({ summary: 'Get cached assets for a player' })
	@ApiParam({
		name: 'nameTag',
		required: true,
		type: 'string',
		description: 'Must be a valid Valorant name with # separating the name and the tag',
		example: 'Hexennacht#NA1'
	})
	@ApiQuery({ name: 'region', required: false, enum: VALID_REGIONS, enumName: 'ValidRegions', type: 'string' })
	@ApiQuery({ name: 'platform', required: false, enum: VALID_PLATFORMS, enumName: 'ValidPlatforms', type: 'string' })
	@ApiQuery({ name: 'mode', required: false, enum: VALID_MODES, enumName: 'ValidModes', type: 'string' })
	@ApiResponse({
		status: 200,
		description: 'A list of cached assets',
		schema: { type: 'array', items: { type: 'string', format: 'url' } }
	})
	async getCachedAssets(
		@Param('nameTag', NameTagValidationPipe) nameTag: NameTag,
		@Query('region', RegionValidationPipe) region: string,
		@Query('platform', PlatformValidationPipe) platform: string,
		@Query('mode', ModeValidationPipe) mode: string
	) {
		const response = await this.playersService.getCachedAssets(region, platform, nameTag.name, nameTag.tag, mode)

		return response
	}
}
