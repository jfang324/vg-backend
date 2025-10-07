import { Performance } from '@common/types/performance.type'
import { Performance as DB_Performance } from '@modules/database/types/performance.db.types'

export const mockPerformances: Performance[] = [
	{
		playerId: '0',
		matchId: '0',
		team: 'Red',
		agentId: '0',
		score: 0,
		kills: 0,
		deaths: 0,
		assists: 0,
		damageDealt: 0,
		damageTaken: 0,
		headshots: 0,
		bodyshots: 0,
		legshots: 0,
		rank: {
			id: 0,
			name: 'Rank 0'
		},
		abilityCasts: {
			grenade: 0,
			ability1: 0,
			ability2: 0,
			ultimate: 0
		},
		behavior: {
			afkRounds: 0,
			friendlyFire: {
				incoming: 0,
				outgoing: 0
			},
			roundsInSpawn: 0
		},
		economy: {
			spent: {
				overall: 0,
				average: 0
			},
			loadoutValue: {
				overall: 0,
				average: 0
			}
		}
	},
	{
		playerId: '1',
		matchId: '1',
		team: 'Blue',
		agentId: '1',
		score: 1,
		kills: 1,
		deaths: 1,
		assists: 1,
		damageDealt: 1,
		damageTaken: 1,
		headshots: 1,
		bodyshots: 1,
		legshots: 1,
		rank: {
			id: 1,
			name: 'Rank 1'
		},
		abilityCasts: {
			grenade: 1,
			ability1: 1,
			ability2: 1,
			ultimate: 1
		},
		behavior: {
			afkRounds: 1,
			friendlyFire: {
				incoming: 1,
				outgoing: 1
			},
			roundsInSpawn: 1
		},
		economy: {
			spent: {
				overall: 1,
				average: 1
			},
			loadoutValue: {
				overall: 1,
				average: 1
			}
		}
	}
]

export const mockDbPerformances: DB_Performance[] = [
	{
		player_id: '0',
		match_id: '0',
		team: 'Red',
		agent_id: '0',
		score: 0,
		kills: 0,
		deaths: 0,
		assists: 0,
		damage_dealt: 0,
		damage_taken: 0,
		headshots: 0,
		bodyshots: 0,
		legshots: 0,
		rank: {
			id: 0,
			name: 'Rank 0'
		},
		ability_casts: {
			grenade: 0,
			ability1: 0,
			ability2: 0,
			ultimate: 0
		},
		behavior: {
			afk_rounds: 0,
			friendly_fire: {
				incoming: 0,
				outgoing: 0
			},
			rounds_in_spawn: 0
		},
		economy: {
			spent: {
				overall: 0,
				average: 0
			},
			loadout_value: {
				overall: 0,
				average: 0
			}
		}
	},
	{
		player_id: '1',
		match_id: '1',
		team: 'Blue',
		agent_id: '1',
		score: 1,
		kills: 1,
		deaths: 1,
		assists: 1,
		damage_dealt: 1,
		damage_taken: 1,
		headshots: 1,
		bodyshots: 1,
		legshots: 1,
		rank: {
			id: 1,
			name: 'Rank 1'
		},
		ability_casts: {
			grenade: 1,
			ability1: 1,
			ability2: 1,
			ultimate: 1
		},
		behavior: {
			afk_rounds: 1,
			friendly_fire: {
				incoming: 1,
				outgoing: 1
			},
			rounds_in_spawn: 1
		},
		economy: {
			spent: {
				overall: 1,
				average: 1
			},
			loadout_value: {
				overall: 1,
				average: 1
			}
		}
	}
]
