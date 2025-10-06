import { VALID_REGIONS } from '@common/constants/regions'
import { RegionValidationPipe } from '@common/pipes/region-validation.pipe'
import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { GetMatchDto } from './dtos/get-matches.dto'
import { MatchesService } from './matches.service'

@Controller({
	path: 'matches',
	version: '1'
})
export class MatchesController {
	constructor(private readonly matchesService: MatchesService) {}

	@Get(':id')
	@ApiOperation({ summary: 'Get a match by its id and region' })
	@ApiParam({
		name: 'id',
		required: true,
		type: 'string',
		description: 'The id of the match',
		example: '1234567890'
	})
	@ApiQuery({
		name: 'region',
		required: true,
		enum: VALID_REGIONS,
		enumName: 'ValidRegions',
		type: 'string',
		default: 'na'
	})
	@ApiResponse({ status: 200, description: 'A match by its id', type: GetMatchDto })
	async getMatch(@Param('id') id: string, @Query('region', RegionValidationPipe) region: string) {
		return await this.matchesService.getMatch(id, region)
	}
}
