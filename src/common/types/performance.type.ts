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
	rank: {
		id: number
		name: string
	}
}
