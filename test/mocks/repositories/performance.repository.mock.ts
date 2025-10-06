import { Performance } from '@common/types/performance.type'
import { PerformanceRepository } from '@modules/database/supabase_repositories/performance.repository'

export const mockPerformances = [
	{
		player_id: '8918b04d-9034-5838-b3ed-dd7ae3efe5e5',
		match_id: 'a181a03a-c839-4f87-9ac7-dcd2975da17f',
		team: 'Red',
		agent_id: 'a3bfb853-43b2-7238-a4f1-ad90e9e46bcc',
		score: 4174,
		kills: 14,
		deaths: 13,
		assists: 4,
		damage_dealt: 2510,
		damage_taken: 2606,
		headshots: 10,
		bodyshots: 24,
		legshots: 1,
		ability_casts: {
			grenade: 15,
			ability1: 7,
			ability2: 6,
			ultimate: 2
		},
		rank: {
			id: 15,
			name: 'Platinum 1'
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
				overall: 49050,
				average: 2725
			},
			loadout_value: {
				overall: 64050,
				average: 3558.3333
			}
		}
	},
	{
		player_id: '8918b04d-9034-5838-b3ed-dd7ae3efe5e5',
		match_id: 'a181a03a-c839-4f87-9ac7-dcd2975da17f',
		team: 'Red',
		agent_id: 'add6443a-41bd-e414-f6ad-e58d267f4e95',
		score: 6029,
		kills: 23,
		deaths: 10,
		assists: 4,
		damage_dealt: 4036,
		damage_taken: 2013,
		headshots: 14,
		bodyshots: 25,
		legshots: 3,
		ability_casts: {
			grenade: 8,
			ability1: 2,
			ability2: 18,
			ultimate: 3
		},
		rank: {
			id: 15,
			name: 'Platinum 1'
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
				overall: 51100,
				average: 2838.889
			},
			loadout_value: { overall: 72150, average: 4008.3333 }
		}
	}
] as unknown as Performance[]

export const mockPerformanceRepository: jest.Mocked<PerformanceRepository> = {
	upsertMany: jest.fn(),
	getByMatchId: jest.fn()
} as unknown as jest.Mocked<PerformanceRepository>

jest.mock('@modules/database/supabase_repositories/performance.repository', () => ({
	PerformanceRepository: jest.fn(() => mockPerformanceRepository)
}))
