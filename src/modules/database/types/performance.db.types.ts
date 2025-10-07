export type Performance = {
	player_id: string
	match_id: string
	team: string
	agent_id: string
	score: number
	kills: number
	deaths: number
	assists: number
	damage_dealt: number
	damage_taken: number
	headshots: number
	bodyshots: number
	legshots: number
	rank?: {
		id: number
		name: string
	}
	ability_casts?: {
		grenade: number
		ability1: number
		ability2: number
		ultimate: number
	}
	behavior?: {
		afk_rounds: number
		friendly_fire: {
			incoming: number
			outgoing: number
		}
		rounds_in_spawn: number
	}
	economy?: {
		spent: {
			overall: number
			average: number
		}
		loadout_value: {
			overall: number
			average: number
		}
	}
}
