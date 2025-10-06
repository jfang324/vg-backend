import { MatchDto, PlayerDto, StatsDto } from '@common/types/dtos/generic.dto'
import { ApiProperty } from '@nestjs/swagger'

class MatchPerformanceDto extends PlayerDto {
	@ApiProperty({ type: StatsDto })
	stats: StatsDto
}

class GetMatchPayloadDto {
	@ApiProperty({ type: MatchDto })
	match: MatchDto

	@ApiProperty({ type: [MatchPerformanceDto] })
	players: MatchPerformanceDto[]
}

export class GetMatchDto {
	@ApiProperty()
	message: string

	@ApiProperty({ type: GetMatchPayloadDto })
	data: GetMatchPayloadDto
}
