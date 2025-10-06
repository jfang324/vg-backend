import { Agent } from '@common/types/agent.type'
import { AgentRepository } from '@modules/database/supabase_repositories/agent.repository'

export const mockAgents = [
	{
		id: 'a3bfb853-43b2-7238-a4f1-ad90e9e46bcc',
		name: 'Reyna'
	},
	{
		id: 'add6443a-41bd-e414-f6ad-e58d267f4e95',
		name: 'Jett'
	},
	{
		id: 'dade69b4-4f5a-8528-247b-219e5a1facd6',
		name: 'Fade'
	},
	{
		id: '41fb69c1-4189-7b37-f117-bcaf1e96f1bf',
		name: 'Astra'
	},
	{
		id: 'f94c3b30-42be-e959-889c-5aa313dba261',
		name: 'Raze'
	},
	{
		id: '1e58de9c-4950-5125-93e9-a0aee9f98746',
		name: 'Killjoy'
	},
	{
		id: '22697a3d-45bf-8dd7-4fec-84a9e28c69d7',
		name: 'Chamber'
	},
	{
		id: '7f94d92c-4234-0a36-9646-3a87eb8b5c89',
		name: 'Yoru'
	},
	{
		id: '569fdd95-4d10-43ab-ca70-79becc718b46',
		name: 'Sage'
	}
] as unknown as Agent[]

export const mockAgentRepository: jest.Mocked<AgentRepository> = {
	upsertMany: jest.fn(),
	getManyByIds: jest.fn()
} as unknown as jest.Mocked<AgentRepository>

jest.mock('@modules/database/supabase_repositories/agent.repository', () => ({
	AgentRepository: jest.fn(() => mockAgentRepository)
}))
