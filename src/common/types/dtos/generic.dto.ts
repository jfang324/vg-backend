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

class AgentDto {
	@ApiProperty()
	id: string

	@ApiProperty()
	name: string

	@ApiPropertyOptional()
	img?: string
}

class RankDto {
	@ApiProperty()
	id: number

	@ApiProperty()
	name: string

	@ApiPropertyOptional()
	img?: string
}

class CustomizationDto {
	@ApiProperty()
	card: string

	@ApiProperty()
	title: string

	@ApiProperty()
	preferred_level_border: string

	@ApiProperty()
	card_img?: string
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

	@ApiProperty({ type: CustomizationDto })
	customization: CustomizationDto

	@ApiProperty({ type: RankDto })
	rank: RankDto
}

class AbilityCastsDto {
	@ApiProperty()
	grenade: number

	@ApiProperty()
	ability1: number

	@ApiProperty()
	ability2: number

	@ApiProperty()
	ultimate: number
}

class FriendlyFireDto {
	@ApiProperty()
	incoming: number

	@ApiProperty()
	outgoing: number
}

class BehaviourDto {
	@ApiProperty()
	afk_rounds: number

	@ApiProperty({ type: FriendlyFireDto })
	friendly_fire: FriendlyFireDto

	@ApiProperty()
	rounds_in_spawn: number
}

class SubEconomyDto {
	@ApiProperty()
	overall: number

	@ApiProperty()
	average: number
}

export class EconomyDto {
	@ApiProperty({ type: SubEconomyDto })
	spent: SubEconomyDto

	@ApiProperty({ type: SubEconomyDto })
	earned: SubEconomyDto
}

export class StatsDto {
	@ApiProperty()
	team: string

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

	@ApiProperty({ type: AgentDto })
	agent: AgentDto

	@ApiProperty({ type: RankDto })
	rank: RankDto

	@ApiProperty({ type: AbilityCastsDto, nullable: true })
	ability_casts?: AbilityCastsDto

	@ApiProperty({ type: BehaviourDto, nullable: true })
	behavior?: BehaviourDto

	@ApiProperty({ type: EconomyDto, nullable: true })
	economy?: EconomyDto
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
}
