import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class MapDto {
	@ApiProperty()
	id: string

	@ApiProperty()
	name: string

	@ApiPropertyOptional()
	img?: string
}

export class ModeDto {
	@ApiProperty()
	id: string

	@ApiProperty()
	name: string
}

export class AgentDto {
	@ApiProperty()
	id: string

	@ApiProperty()
	name: string

	@ApiPropertyOptional()
	img?: string
}

export class RankDto {
	@ApiProperty()
	id: number

	@ApiProperty()
	name: string

	@ApiPropertyOptional()
	img?: string
}

export class CustomizationDto {
	@ApiProperty()
	card?: string

	@ApiPropertyOptional()
	card_img?: string

	@ApiProperty()
	title?: string

	@ApiProperty()
	preferred_level_border?: string
}

export class PlayerDto {
	@ApiProperty()
	id: string

	@ApiProperty()
	name: string

	@ApiProperty()
	tag: string

	@ApiProperty()
	region: string

	@ApiProperty()
	level: number

	@ApiProperty({ type: AgentDto })
	agent: AgentDto

	@ApiProperty({ type: RankDto })
	rank: RankDto

	@ApiProperty({ type: CustomizationDto })
	customization: CustomizationDto
}

export class PerformanceDto {
	@ApiProperty({ type: PlayerDto })
	player: PlayerDto

	@ApiProperty()
	team: string

	@ApiProperty({ type: AgentDto })
	agent: AgentDto

	@ApiProperty()
	score: number

	@ApiProperty()
	kills: number

	@ApiProperty()
	deaths: number

	@ApiProperty()
	assists: number

	@ApiProperty()
	damage_dealt: number

	@ApiProperty()
	damage_taken: number

	@ApiProperty()
	headshots: number

	@ApiProperty()
	bodyshots: number

	@ApiProperty()
	legshots: number

	@ApiProperty({ type: Object, nullable: true })
	ability_casts: Record<string, string>

	@ApiProperty({ type: Object, nullable: true })
	rank: RankDto

	@ApiProperty({ type: Object, nullable: true })
	behavior: Record<string, string>

	@ApiProperty({ type: Object, nullable: true })
	economy: Record<string, string>
}

export class MatchDto {
	@ApiProperty()
	id: string

	@ApiProperty({ type: MapDto })
	map: MapDto

	@ApiProperty({ type: ModeDto })
	mode: ModeDto

	@ApiProperty()
	date: Date

	@ApiProperty()
	winning_team: string

	@ApiProperty({ type: [PerformanceDto] })
	players: PerformanceDto[]
}

export class GetRecentMatchesDto {
	@ApiProperty()
	message: string

	@ApiProperty({ type: [MatchDto] })
	data: MatchDto[]
}
