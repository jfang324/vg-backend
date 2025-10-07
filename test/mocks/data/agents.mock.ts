import { Agent } from '@common/types/agent.type'
import { Agent as DB_Agent } from '@modules/database/types/agent.db.type'

export const mockAgents: Agent[] = [
	{
		id: '0',
		name: 'Agent 0'
	},
	{
		id: '1',
		name: 'Agent 1'
	},
	{
		id: '2',
		name: 'Agent 2'
	}
]

export const mockDbAgents: DB_Agent[] = [
	{
		id: '0',
		name: 'Agent 0'
	},
	{
		id: '1',
		name: 'Agent 1'
	},
	{
		id: '2',
		name: 'Agent 2'
	}
]
