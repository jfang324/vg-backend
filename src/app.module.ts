import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HenrikDevModule } from './integrations/henrik-dev/henrik-dev.module'
import { DatabaseModule } from './modules/database/database.module'
import { HealthModule } from './modules/health/health.module'
import { LoggingModule } from './modules/logging/logging.module'
import { MatchesModule } from './modules/matches/matches.module'
import { PlayersModule } from './modules/players/players.module'
import { RedisModule } from './modules/redis/redis.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		HenrikDevModule,
		PlayersModule,
		MatchesModule,
		HealthModule,
		LoggingModule,
		DatabaseModule,
		RedisModule
	]
})
export class AppModule {}
