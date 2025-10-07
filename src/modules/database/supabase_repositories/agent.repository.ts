import { Agent } from '@common/types/agent.type'
import { Database } from '@generated/supabase/database.types'
import { LoggingService } from '@modules/logging/logging.service'
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { SupabaseClient } from '@supabase/supabase-js'
import { AgentRepositoryInterface } from '../interfaces/agent.repository.interface'
import { Agent as DB_Agent } from '../types/agent.db.type'

@Injectable()
export class AgentRepository implements AgentRepositoryInterface {
	private localAgents: Map<string, Agent> = new Map()

	constructor(
		@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient<Database>,
		private readonly loggingService: LoggingService
	) {}

	/**
	 * Transform a database agent into a domain agent
	 * @param dbAgent The database agent to transform
	 * @returns The transformed agent
	 */
	private mapDbToDomain(dbAgent: DB_Agent): Agent {
		return {
			id: dbAgent.id,
			name: dbAgent.name
		}
	}

	/**
	 * Transform a domain agent into a database agent
	 * @param agent The domain agent to transform
	 * @returns The transformed agent
	 */
	private mapDomainToDb(agent: Agent): DB_Agent {
		return {
			id: agent.id,
			name: agent.name
		}
	}

	/**
	 * On module init, retrieve all agents from the database and store them locally
	 */
	async onModuleInit() {
		const { data, error } = await this.supabase.from('agents').select('*').select()

		if (error) {
			this.loggingService.logDatabaseError('Agent', 'onModuleInit', error.message)
			throw new InternalServerErrorException(`Failed to retrieve agents from database: ${error.message}`)
		}

		const dbAgents = data
		const agents = dbAgents.map((agent) => this.mapDbToDomain(agent))

		for (const agent of agents) {
			this.localAgents.set(agent.id, agent)
		}
	}

	/**
	 * Upsert multiple agents in the database if they aren't stored locally
	 * @param agents The agents to upsert
	 * @returns The upserted agents
	 */
	async upsertMany(agents: Agent[]): Promise<Agent[]> {
		const newAgents = agents.filter((agent) => !this.localAgents.has(agent.id))

		if (newAgents.length === 0) {
			return agents
		}

		const dbAgents = newAgents.map((agent) => this.mapDomainToDb(agent))

		const { data: _, error } = await this.supabase
			.from('agents')
			.upsert(dbAgents, { onConflict: 'id', ignoreDuplicates: true })

		if (error) {
			this.loggingService.logDatabaseError('Agent', 'upsertMany', error.message)
			return newAgents
		}

		agents.map((agent) => this.localAgents.set(agent.id, agent))

		return agents
	}

	/**
	 * Get many agents by ids
	 * @param ids The ids of the agents to find
	 * @returns The found agents
	 */
	async getManyByIds(ids: string[]): Promise<Agent[]> {
		const cachedAgents = ids.map((id) => this.localAgents.get(id)).filter((agent) => !!agent)

		if (cachedAgents.length === ids.length) {
			return cachedAgents
		}

		const { data, error } = await this.supabase.from('agents').select('*').in('id', ids)

		if (error) {
			this.loggingService.logDatabaseError('Agent', 'getManyByIds', error.message)
			return []
		}

		const agents = data.map((agent) => this.mapDbToDomain(agent))

		agents.map((agent) => this.localAgents.set(agent.id, agent))

		return agents
	}
}
