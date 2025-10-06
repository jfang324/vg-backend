import { Agent } from '@common/types/agent.type'

export interface AgentRepositoryInterface {
	upsertMany(agents: Agent[]): Promise<Agent[]>
	getManyByIds(ids: string[]): Promise<Agent[]>
}
