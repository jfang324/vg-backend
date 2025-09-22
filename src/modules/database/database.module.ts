import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { createSupabaseClient } from './connections/supabase.connection'
import { AgentRepository } from './supabase_repositories/agent.repository'
import { MapRepository } from './supabase_repositories/map.repository'
import { MatchRepository } from './supabase_repositories/match.repository'
import { ModeRepository } from './supabase_repositories/mode.repository'
import { PerformanceRepository } from './supabase_repositories/performance.repository'
import { PlayerRepository } from './supabase_repositories/player.repository'

@Global()
@Module({
	imports: [ConfigModule],
	providers: [
		{
			provide: 'SUPABASE_CLIENT',
			inject: [ConfigService],
			useFactory: () => createSupabaseClient()
		},
		MapRepository,
		AgentRepository,
		MatchRepository,
		ModeRepository,
		PlayerRepository,
		PerformanceRepository
	],
	exports: [MapRepository, AgentRepository, MatchRepository, ModeRepository, PlayerRepository, PerformanceRepository]
})
export class DatabaseModule {}
