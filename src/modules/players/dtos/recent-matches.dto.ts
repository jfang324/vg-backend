import { MatchDto, PlayerDto, StatsDto } from '@common/types/dtos/generic.dto'
import { ApiProperty, OmitType } from '@nestjs/swagger'

class RecentMatchDto extends MatchDto {
	@ApiProperty({ type: StatsDto })
	stats: StatsDto
}

class RecentMatchesPayloadDto {
	@ApiProperty({ type: PlayerDto })
	player: PlayerDto

	@ApiProperty({ type: [RecentMatchDto] })
	matches: RecentMatchDto[]
}

export class GetRecentMatchesDto {
	@ApiProperty()
	message: string

	@ApiProperty({ type: RecentMatchesPayloadDto })
	data: RecentMatchesPayloadDto
}

class StoredMatchStatsDto extends OmitType(StatsDto, ['ability_casts', 'behavior', 'economy']) {}

class StoredMatchDto extends MatchDto {
	@ApiProperty({ type: StoredMatchStatsDto })
	stats: StoredMatchStatsDto
}

class StoredMatchPayloadDto {
	@ApiProperty({ type: PlayerDto })
	player: PlayerDto

	@ApiProperty({ type: [StoredMatchDto] })
	matches: StoredMatchDto[]
}

export class GetStoredMatchesDto {
	@ApiProperty()
	message: string

	@ApiProperty({ type: StoredMatchPayloadDto })
	data: StoredMatchPayloadDto
}
