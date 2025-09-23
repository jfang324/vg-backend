import { Agent } from '@common/types/agent.type'
import { Database } from '@generated/supabase/database.types'
import { LoggingService } from '@modules/logging/logging.service'
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { SupabaseClient } from '@supabase/supabase-js'
import { AgentRepositoryInterface } from '../interfaces/agent.repository.interface'

@Injectable()
export class AgentRepository implements AgentRepositoryInterface {
	private localAgents: Map<string, Agent> = new Map()

	constructor(
		@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient<Database>,
		private readonly loggingService: LoggingService
	) {}

	/**
	 * On module init, retrieve all agents from the database and store them locally
	 */
	async onModuleInit() {
		const { data, error } = await this.supabase.from('agents').select('*').select()

		if (error) {
			this.loggingService.logDatabaseError('Agent', error.message)
			throw new InternalServerErrorException(`Failed to retrieve agents from database: ${error.message}`)
		}

		data.map((agent) => this.localAgents.set(agent.id, agent))
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

		const { data: _, error } = await this.supabase
			.from('agents')
			.upsert(agents, { onConflict: 'id', ignoreDuplicates: true })

		if (error) {
			this.loggingService.logDatabaseError('Agent', error.message)
			return newAgents
		}

		agents.map((agent) => this.localAgents.set(agent.id, agent))

		return agents
	}
}
